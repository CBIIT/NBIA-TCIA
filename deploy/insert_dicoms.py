#!/usr/bin/env python3

import json
import time
import os
from typing import NamedTuple
from getpass import getpass
import csv
import sys
from tqdm import tqdm

import requests

URL = "http://localhost"
USER = ""
PASS = ""
CLIENTID = "nbiaRestAPIClient"
CLIENTSECRET = "ItsBetweenUAndMe"
RETRY_COUNT = 1

TOKEN = None


class LoginFailedError(RuntimeError):
    pass


class LoginExpiredError(RuntimeError):
    pass


class SubmitFailedError(RuntimeError):
    pass


class File(NamedTuple):
    subprocess_invocation_id: int
    file_id: int
    collection: str
    site: str
    site_id: int
    batch: int
    filename: str
    third_party_analysis_url: str


def send_one(file_location, collection, site):
    file = File(
        subprocess_invocation_id=0,  # does not matter
        file_id=141703361,  # does not matter
        collection=collection,
        site=site,
        site_id=23153719,
        batch=5247,  # does not matter
        filename=os.path.join("/opt/dicoms", file_location),
        third_party_analysis_url=None,  # does not matter
    )
    try:
        _submit_file(file)
    except SubmitFailedError as e:
        # probably should put this onto a failed-file list now?
        print(e)


def submit_file(f):
    """Submit the file, try several times before giving up"""
    global TOKEN

    errors = []
    for i in range(RETRY_COUNT):
        try:
            return _submit_file(f)
        except SubmitFailedError as e:
            errors.append(e)
        except requests.exceptions.ConnectionError as e:
            errors.append(e)
            print("WAIT: Server rejected connection, waiting 1 second for retry...")
            time.sleep(1)  # wait a bit for the server to get over it's funk
        except LoginExpiredError:
            TOKEN = login_to_api()

    raise SubmitFailedError(
        ("Failed to submit the file; error details follow", f, errors)
    )


def _submit_file(f):
    tpa_url = f.third_party_analysis_url

    if tpa_url is None:
        tpa_url = ""

    if len(tpa_url) > 0:
        tpa = "yes"
    else:
        tpa = "NO"

    payload = {
        "project": f.collection,
        "siteName": f.site,
        "siteID": f.site_id,
        "batch": f.batch,
        "uri": f.filename,
        "thirdPartyAnalysis": tpa,
        "descriptionURI": tpa_url,
    }
    headers = {
        "Authorization": "Bearer {}".format(TOKEN),
    }
    req = requests.post(
        URL + "/nbia-api/services/submitDICOM", headers=headers, data=payload
    )

    if req.status_code == 200:
        return
    elif req.status_code == 401:
        # indicates an acess error, generally an expired token
        message = req.json()
        if message["error"] == "invalid_token":
            raise LoginExpiredError()
        else:
            raise SubmitFailedError(req.content)
    else:
        raise SubmitFailedError((req.status_code, req.content))


def login_to_api():
    payload = {
        "username": USER,
        "password": PASS,
        "client_id": CLIENTID,
        "client_secret": CLIENTSECRET,
        "grant_type": "password",
    }
    req = requests.post(URL + "/nbia-api/oauth/token", data=payload)

    if req.status_code == 200:
        obj = req.json()
        return obj["access_token"]
    else:
        raise LoginFailedError(req.content)


def login_or_die():
    for i in range(10):
        try:
            return login_to_api()
        except LoginFailedError as e:
            print(e)
            time.sleep(1)

    raise LoginFailedError("Login failed too many times, see previous errors!")


def main():
    global TOKEN
    global USER
    global PASS
    if len(sys.argv) != 3:
        print("Usage: python script.py <path_to_csv> <username>")
        sys.exit(1)
    csv_file_path = sys.argv[1]
    csv_directory = os.path.dirname(csv_file_path)
    intermediate_dir = os.path.basename(os.path.normpath(csv_directory))
    USER = sys.argv[2]
    PASS = getpass("{}'s password: ".format(USER))

    TOKEN = login_or_die()
    print(f"logged in to api, token={TOKEN}")

    with open(csv_file_path, "r") as csvfile:
        row_count = sum(1 for row in csvfile)
        csvfile.seek(0)
        reader = csv.DictReader(csvfile)
        for row in tqdm(
            reader, position=0, desc="Overall Progress", total=(row_count - 1)
        ):
            relative_file_location = row["File Location"]
            collection = row["Collection"]
            site = "Public"
            file_dir = os.path.join(csv_directory, relative_file_location)
            relative_file_path = relative_file_location.lstrip("./")
            for dicom in tqdm(
                os.listdir(file_dir), position=1, desc="Series Progress", leave=False
            ):
                if os.path.isfile(os.path.join(file_dir, dicom)):
                    dicom_path = os.path.join(
                        intermediate_dir, relative_file_path, dicom
                    )
                    send_one(dicom_path, collection, site)


if __name__ == "__main__":
    main()
