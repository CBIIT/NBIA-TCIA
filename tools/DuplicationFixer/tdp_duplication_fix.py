#!/usr/bin/env python3

import os
import sys
import mariadb
from tqdm import tqdm

DRY_RUN = False

# Get connection parameters from environment variables
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT', 3306)
DB_USER = os.getenv('DB_USER', 'nciauser')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_DATABASE = os.getenv('DB_DATABASE', 'ncia')

# Get collection and site from command-line arguments
collection = sys.argv[1]
site = sys.argv[2]

def update_tables(bad_id, good_id):
    if DRY_RUN:
        print(f'Update Tables: {bad_id} -> {good_id}')
        return
    cur.execute("""
        update general_image
        set patient_pk_id=%s
        where patient_pk_id=%s
    """, (good_id,bad_id))
    cur.execute("""
        update general_series
        set patient_pk_id=%s
        where patient_pk_id=%s
    """, (good_id,bad_id))
    cur.execute("""
        update study
        set patient_pk_id=%s
        where patient_pk_id=%s
    """, (good_id,bad_id))

def bulk_update_tables(bad_ids, good_id, patient_id):
    if DRY_RUN:
        print(f'Update Tables: {bad_ids} -> {good_id}')
        return
    if len(bad_ids) == 0:
        return
    cur.execute("drop table working_dupe_patients")
    conn.commit()
    cur.execute("""
        create table working_dupe_patients as
        select patient_pk_id from patient
            where patient_id = %s
            and patient_pk_id != %s
        """, (patient_id, good_id))
    conn.commit()
    cur.execute("""
        update general_image
        set patient_pk_id=%s
        where patient_pk_id in (select patient_pk_id from working_dupe_patients)
    """, (good_id,))
    cur.execute("""
        update general_series
        set patient_pk_id=%s
        where patient_pk_id in (select patient_pk_id from working_dupe_patients)
    """, (good_id,))
    cur.execute("""
        update study
        set patient_pk_id=%s
        where patient_pk_id in (select patient_pk_id from working_dupe_patients)
    """, (good_id,))
    conn.commit()

def update_patient(patient_pk_id, good_tdp_id):
    if DRY_RUN:
        print(f'Update Patient: {patient_pk_id} -> {good_tdp_id}')
        return
    cur.execute("""
        update patient
        set trial_dp_pk_id=%s
        where patient_pk_id=%s
    """, (good_tdp_id,patient_pk_id))

def delete_patient(patient_pk_id):
    if DRY_RUN:
        print(f'Delete Patient: {patient_pk_id}')
        return
    cur.execute("""
        delete from patient
        where patient_pk_id=%s
    """, (patient_pk_id,))

def update_gi_tdp(good_id, bad_id):
    if DRY_RUN:
        print(f'Update GI TDP: {bad_id} -> {good_id}')
        return
    cur.execute("""
        update general_image
        set trial_dp_pk_id=%s
        where trial_dp_pk_id=%s
    """, (good_id,bad_id))
    conn.commit()

def delete_tdp(trial_dp_pk_id):
    if DRY_RUN:
        print(f'Delete TDP: {trial_dp_pk_id}')
        return
    cur.execute("""
        delete from trial_data_provenance
        where trial_dp_pk_id=%s
    """, (trial_dp_pk_id,))
    conn.commit()

def fix_patient(patient_id, patient_dict, correct_tdp_id):
    good_id = patient_dict['good_id']
    bad_ids = patient_dict['bad_ids']
    if good_id == None:
        good_id = bad_ids.pop()
        update_patient(good_id, correct_tdp_id)
    # bulk_update_tables(bad_ids, good_id, patient_id)
    progress_bar2 = tqdm(bad_ids)
    for bad_id in progress_bar2:
        progress_bar2.set_description(f'Updating: {patient_id} -> {bad_id}')
        update_tables(bad_id, good_id)
        delete_patient(bad_id)
    conn.commit()


# Connect to the database
conn = mariadb.connect(
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_DATABASE,
    autocommit=False
)

# Create a cursor object
cur = conn.cursor()

# Find TDP id which is properly linked to the site
cur.execute("""
    select tdp.trial_dp_pk_id from trial_data_provenance tdp
    join site s on s.trial_dp_pk_id = tdp.trial_dp_pk_id
    where tdp.project=%s AND s.dp_site_name=%s
    """, (collection, site))
# Fetch the results
results = cur.fetchall()

if len(results) != 1:
    print(f'Found {len(results)} correct tdp rows, was expecting exactly 1')
    exit()

correct_tdp_id = results[0][0]
print(f'Correct TDP: {correct_tdp_id}')

# Find all duplicate TDP ids
cur.execute("""
    select tdp.trial_dp_pk_id from trial_data_provenance tdp
    where tdp.project=%s AND tdp.trial_dp_pk_id!=%s
    """, (collection, correct_tdp_id))
# Fetch the results
results = cur.fetchall()

duplicate_tdp_ids = [result[0] for result in results]
print(f'Found {len(duplicate_tdp_ids)} duplicate tdp ids')

# Find all duplicate patients
cur.execute("""
    select patient_pk_id, patient_id, p.trial_dp_pk_id  from patient p
    join trial_data_provenance tdp on tdp.trial_dp_pk_id = p.trial_dp_pk_id
    where tdp.project = %s
    order by patient_id""", (collection,))
results = cur.fetchall()

patients = {}
for row in results:
    patient_pk_id = row[0]
    patient_id = row[1]
    trial_dp_pk_id = row[2]
    if patient_id not in patients.keys():
        patients[patient_id] = {}
        patients[patient_id]['bad_ids'] = []
        patients[patient_id]['good_id'] = None
    if trial_dp_pk_id == correct_tdp_id:
        patients[patient_id]['good_id'] = patient_pk_id
    else:
        patients[patient_id]['bad_ids'].append(patient_pk_id)

progress_bar = tqdm(patients.keys())
for patient_id in progress_bar:
    if not DRY_RUN:
        progress_bar.set_description(f'Updating: {patient_id}')
    fix_patient(patient_id, patients[patient_id], correct_tdp_id)

progress_bar = tqdm(duplicate_tdp_ids)
for bad_tdp_id in progress_bar:
    if DRY_RUN:
        print(f'===={bad_tdp_id}')
    else:
        progress_bar.set_description(f'Updating/Deleting TDP: {bad_tdp_id}')
    update_gi_tdp(correct_tdp_id, bad_tdp_id)
    delete_tdp(bad_tdp_id)

# Close the cursor and connection
cur.close()
conn.close()
