// ----------------------------------------------------------------------------------------------------
// -----------------        Returns the full name of a modality by abbreviation      ------------------
// ----------------------------------------------------------------------------------------------------

import { Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )

export class ModalityDescriptionsService{
    descriptions = [
        {
            modality: 'Value',
            description: 'Description'
        },
        {
            modality: 'AR',
            description: 'Autorefraction'
        },
        {
            modality: 'AS',
            description: 'Angioscopy'
        },
        {
            modality: 'ASMT',
            description: 'Content Assessment Results'
        },
        {
            modality: 'AU',
            description: 'Audio'
        },
        {
            modality: 'BDUS',
            description: 'Bone Densitometry (ultrasound)'
        },
        {
            modality: 'BI',
            description: 'Biomagnetic imaging'
        },
        {
            modality: 'BMD',
            description: 'Bone Densitometry (X-Ray)'
        },
        {
            modality: 'CD',
            description: 'Color flow Doppler'
        },
        {
            modality: 'CF',
            description: 'Cinefluorography'
        },
        {
            modality: 'CP',
            description: 'Colposcopy'
        },
        {
            modality: 'CR',
            description: 'Computed Radiography'
        },
        {
            modality: 'CS',
            description: 'Cystoscopy'
        },
        {
            modality: 'CT',
            description: 'Computed Tomography'
        },
        {
            modality: 'DD',
            description: 'Duplex Doppler'
        },
        {
            modality: 'DF',
            description: 'Digital fluoroscopy'
        },
        {
            modality: 'DG',
            description: 'Diaphanography'
        },
        {
            modality: 'DM',
            description: 'Digital microscopy'
        },
        {
            modality: 'DOC',
            description: 'Document'
        },
        {
            modality: 'DS',
            description: 'Digital Subtraction Angiography'
        },
        {
            modality: 'DX',
            description: 'Digital Radiography'
        },
        {
            modality: 'EC',
            description: 'Echocardiography'
        },
        {
            modality: 'ECG',
            description: 'Electrocardiography'
        },
        {
            modality: 'EPS',
            description: 'Cardiac Electrophysiology'
        },
        {
            modality: 'ES',
            description: 'Endoscopy'
        },
        {
            modality: 'FA',
            description: 'Fluorescein angiography'
        },
        {
            modality: 'FID',
            description: 'Fiducials'
        },
        {
            modality: 'FS',
            description: 'Fundoscopy'
        },
        {
            modality: 'GM',
            description: 'General Microscopy'
        },
        {
            modality: 'Value',
            description: 'Description'
        },
        {
            modality: 'HC',
            description: 'Hard Copy'
        },
        {
            modality: 'HD',
            description: 'Hemodynamic Waveform'
        },
        {
            modality: 'IO',
            description: 'Intra-Oral Radiography'
        },
        {
            modality: 'IOL',
            description: 'Intraocular Lens Data'
        },
        {
            modality: 'IVOCT',
            description: 'Intravascular Optical Coherence Tomography'
        },
        {
            modality: 'IVUS',
            description: 'Intravascular Ultrasound'
        },
        {
            modality: 'KER',
            description: 'Keratometry'
        },
        {
            modality: 'KO',
            description: 'Key Object Selection'
        },
        {
            modality: 'LEN',
            description: 'Lensometry'
        },
        {
            modality: 'LP',
            description: 'Laparoscopy'
        },
        {
            modality: 'LS',
            description: 'Laser surface scan'
        },
        {
            modality: 'MA',
            description: 'Magnetic resonance angiography'
        },
        {
            modality: 'MG',
            description: 'Mammography'
        },
        {
            modality: 'MR',
            description: 'Magnetic Resonance'
        },
        {
            modality: 'MS',
            description: 'Magnetic resonance spectroscopy'
        },
        {
            modality: 'NM',
            description: 'Nuclear Medicine'
        },
        {
            modality: 'OAM',
            description: 'Ophthalmic Axial Measurements'
        },
        {
            modality: 'OCT',
            description: 'Optical Coherence Tomography (non-Ophthalmic)'
        },
        {
            modality: 'OP',
            description: 'Ophthalmic Photography'
        },
        {
            modality: 'OPM',
            description: 'Ophthalmic Mapping'
        },
        {
            modality: 'OPR',
            description: 'Ophthalmic Refraction'
        },
        {
            modality: 'OPT',
            description: 'Ophthalmic Tomography'
        },
        {
            modality: 'OPV',
            description: 'Ophthalmic Visual Field'
        },
        {
            modality: 'OSS',
            description: 'Optical Surface Scan'
        },
        {
            modality: 'OT',
            description: 'Other'
        },
        {
            modality: 'Value',
            description: 'Description'
        },
        {
            modality: 'PLAN',
            description: 'Plan'
        },
        {
            modality: 'PR',
            description: 'Presentation State'
        },
        {
            modality: 'PT',
            description: 'Positron emission tomography (PET)'
        },
        {
            modality: 'PX',
            description: 'Panoramic X-Ray'
        },
        {
            modality: 'REG',
            description: 'Registration'
        },
        {
            modality: 'RESP',
            description: 'Respiratory Waveform'
        },
        {
            modality: 'RF',
            description: 'Radio Fluoroscopy'
        },
        {
            modality: 'RG',
            description: 'Radiographic imaging (conventional film/screen)'
        },
        {
            modality: 'RTDOSE',
            description: 'Radiotherapy Dose'
        },
        {
            modality: 'RTIMAGE',
            description: 'Radiotherapy Image'
        },
        {
            modality: 'RTPLAN',
            description: 'Radiotherapy Plan'
        },
        {
            modality: 'RTRECORD',
            description: 'RT Treatment Record'
        },
        {
            modality: 'RTSTRUCT',
            description: 'Radiotherapy Structure Set'
        },
        {
            modality: 'RWV',
            description: 'Real World Value Map'
        },
        {
            modality: 'SEG',
            description: 'Segmentation'
        },
        {
            modality: 'SM',
            description: 'Slide Microscopy'
        },
        {
            modality: 'SMR',
            description: 'Stereometric Relationship'
        },
        {
            modality: 'SR',
            description: 'SR Document'
        },
        {
            modality: 'SRF',
            description: 'Subjective Refraction'
        },
        {
            modality: 'ST',
            description: 'Single-photon emission computed tomography (SPECT)'
        },
        {
            modality: 'STAIN',
            description: 'Automated Slide Stainer'
        },
        {
            modality: 'TG',
            description: 'Thermography'
        },
        {
            modality: 'US',
            description: 'Ultrasound'
        },
        {
            modality: 'VA',
            description: 'Visual Acuity'
        },
        {
            modality: 'VF',
            description: 'Videofluorography'
        },
        {
            modality: 'XA',
            description: 'X-Ray Angiography'
        },
        {
            modality: 'XC',
            description: 'External-camera Photography'
        }
    ];


    constructor() {
    }

    getModalityDescription( modality: string){
        for( let imageModality of this.descriptions ){
            if( modality.toUpperCase() === imageModality.modality.toUpperCase()){
                return imageModality.description;
            }
        }
        return null;
    }

}


