import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InitMonitorService{

    collectionsInit = false;
    modalityInit = false;
    anatomicalSiteInit = false;
    speciesInit = false;
    phantomsInit = false;
    thirdPartyInit = false;
    excludeCommercialInit = false;
    daysFromBaselineInit = false;
    minimumStudiesInit = false;
    dateRangeInit = false;

    collectionsRunning = false;
    modalityRunning = false;
    anatomicalSiteRunning = false;
    speciesRunning = false;
    phantomsRunning = false;
    thirdPartyRunning = false;
    excludeCommercialRunning = false;
    daysFromBaselineRunning = false;
    minimumStudiesRunning = false;
    dateRangeRunning = false;

    patientSexInit = false;
    patientAgeRangeInit = false;
    patientHeightRangeInit = false;
    patientWeightRangeInit = false;
    sliceThicknessRangeInit = false;
    imageDescriptionInit = false;
    pixelSpacingRangeInit = false;
    nbiaProgramInit = false;
    subjectIdInit = false;
    seriesCriteriaInit = false;
    studyCriteriaInit = false;

    patientSexRunning = false;
    patientAgeRangeRunning = false;
    patientHeightRangeRunning = false;
    patientWeightRangeRunning = false;
    sliceThicknessRangeRunning = false;
    imageDescriptionRunning = false;
    pixelSpacingRangeRunning = false;
    nbiaProgramRunning = false;
    subjectIdRunning = false;
    seriesCriteriaRunning = false;
    studyCriteriaRunning = false;   

    manufacturerInit = false;
    manufacturerRunning = false;    

    constructor() {
    }

    setDateRangeInit( status ) {
        this.dateRangeInit = status;
    }

    getDateRangeInit() {
        return this.dateRangeInit;
    }

    setCollectionsInit( status ) {
        this.collectionsInit = status;
    }

    getCollectionsInit() {
        return this.collectionsInit;
    }

    setModalityInit( status ) {
        this.modalityInit = status;
    }

    getModalityInit() {
        return this.modalityInit;
    }


    setAnatomicalSiteInit( status ) {
        this.anatomicalSiteInit = status;
    }

    getAnatomicalSiteInit() {
        return this.anatomicalSiteInit;
    }

    setSpeciesInit( status ) {
        this.speciesInit = status;
    }

    getSpeciesInit() {
        return this.speciesInit;
    }

    setPhantomsInit( status ) {
        this.phantomsInit = status;
    }

    getPhantomsInit() {
        return this.phantomsInit;
    }

    setThirdPartyInit( status ) {
        this.thirdPartyInit = status;
    }

    getThirdPartyInit() {
        return this.thirdPartyInit;
    }

    setExcludeCommercialInit( status ) {
        this.excludeCommercialInit = status;
    }

    getExcludeCommercialInit() {
        return this.excludeCommercialInit;
    }


    setDaysFromBaselineInit( status ) {
        this.daysFromBaselineInit = status;
    }

    getDaysFromBaselineInit() {
        return this.daysFromBaselineInit;
    }

    setMinimumStudiesInit( status ) {
        this.minimumStudiesInit = status;
    }

    getMinimumStudiesInit() {
        return this.minimumStudiesInit;
    }

    setPatientAgeRangeInit( status ) {
        this.patientAgeRangeInit = status;
    }

    getPatientAgeRangeInit() {
        return this.patientAgeRangeInit;
    }

    setPatientSexInit( status ) {
        this.patientSexInit = status;
    }

    getPatientSexInit() {
        return this.patientSexInit;
    }

    setPatientHeightRangeInit( status ) {
        this.patientHeightRangeInit = status;
    }

    getPatientHeightRangeInit() {
        return this.patientHeightRangeInit;
    }

    setPatientWeightRangeInit( status ) {
        this.patientWeightRangeInit = status;
    }
    getPatientWeightRangeInit() {
        return this.patientWeightRangeInit;
    }

    setSliceThicknessRangeInit( status ) {
        this.sliceThicknessRangeInit = status;
    }

    getSliceThicknessRangeInit() {
        return this.sliceThicknessRangeInit;
    }
    setImageDescriptionInit( status ) {
        this.imageDescriptionInit = status;
    }

    getImageDescriptionInit() {
        return this.imageDescriptionInit;
    }

    setPixelSpacingRangeInit( status ) {
        this.pixelSpacingRangeInit = status;
    }

    getPixelSpacingRangeInit() {
        return this.pixelSpacingRangeInit;
    }   

    setManufacturerInit( status ) {
        this.manufacturerInit = status;
    }

    getManufacturerInit() {
        return this.manufacturerInit;
    }   

    setNbiaProgramInit( status ) {      
        this.nbiaProgramInit = status;
    }

    getNbiaProgramInit() {
        return this.nbiaProgramInit;
    } 
    
    setSubjectIdInit( status ) {
        this.subjectIdInit = status;
    }

    getSubjectIdInit() {
        return this.subjectIdInit;
    }

    setSeriesCriteriaInit( status ) {
        this.seriesCriteriaInit = status;
    }

    getSeriesCriteriaInit() {
        return this.seriesCriteriaInit;
    }

    setStudyCriteriaInit( status ) {
        this.studyCriteriaInit = status;
    }   

    getStudyCriteriaInit() {
        return this.studyCriteriaInit;
    }

    getAnyInit() {
        let res = false;
        if( this.collectionsInit ){
            res = true;
        }
        if( this.modalityInit ){
            res = true;
        }
        if( this.anatomicalSiteInit ){
            res = true;
        }
        if( this.speciesInit ){
            res = true;
        }
        if( this.phantomsInit ){
            res = true;
        }
        if( this.thirdPartyInit ){
            res = true;
        }
        if( this.excludeCommercialInit ){
            res = true;
        }
        if( this.daysFromBaselineInit ){
            res = true;
        }
        if( this.minimumStudiesInit ){
            res = true;
        }
        if( this.dateRangeInit ){
            res = true;
        }
        if( this.patientAgeRangeInit ){
            res = true;
        }
        if( this.patientSexInit ){
            res = true;
        }

        if( this.patientHeightRangeInit ){
            res = true;
        }

        if( this.patientWeightRangeInit ){
            res = true;
        }   

        if( this.sliceThicknessRangeInit ){
            res = true;
        }

        if( this.imageDescriptionInit ){
            res = true;
        }

        if( this.pixelSpacingRangeInit ){
            res = true;
        }

        if( this.manufacturerInit ){
            res = true;
        }  
        
        if( this.nbiaProgramInit ){
            res = true;
        }

        if( this.subjectIdInit ){
            res = true;
        }

        if( this.seriesCriteriaInit ){
            res = true;
        }   

        if( this.studyCriteriaInit ) {    
            res = true;
        }

        return res;
    }


    setDateRangeRunning( status ) {
        this.dateRangeRunning = status;
    }

    getDateRangeRunning() {
        return this.dateRangeRunning;
    }

    setCollectionsRunning( status ) {
        this.collectionsRunning = status;
    }

    getCollectionsRunning() {
        return this.collectionsRunning;
    }

    setModalityRunning( status ) {
        this.modalityRunning = status;
    }

    getModalityRunning() {
        return this.modalityRunning;
    }


    setAnatomicalSiteRunning( status ) {
        this.anatomicalSiteRunning = status;
    }

    getAnatomicalSiteRunning() {
        return this.anatomicalSiteRunning;
    }

    setSpeciesRunning( status ) {
        this.speciesRunning = status;
    }

    getSpeciesRunning() {
        return this.speciesRunning;
    }

    setPhantomsRunning( status ) {
        this.phantomsRunning = status;
    }

    getPhantomsRunning() {
        return this.phantomsRunning;
    }

    setThirdPartyRunning( status ) {
        this.thirdPartyRunning = status;
    }

    getThirdPartyRunning() {
        return this.thirdPartyRunning;
    }

    setMinimumStudiesRunning( status ) {
        this.minimumStudiesRunning = status;
    }

    getMinimumStudiesRunning() {
        return this.minimumStudiesRunning;
    }

    setPatientAgeRangeRunning( status ) {
        this.patientAgeRangeRunning = status;
    }
    
    getPatientAgeRangeRunning() {
        return this.patientAgeRangeRunning;
    }
    
    setPatientSexRunning( status ) {
        this.patientSexRunning = status;
    }
    
    getPatientSexRunning() {
        return this.patientSexRunning;
    }

    setPatientHeightRangeRunning( status ) {
        this.patientHeightRangeRunning = status;
    }

    getPatientHeightRangeRunning() {
        return this.patientHeightRangeRunning;
    }   

    setPatientWeightRangeRunning( status ) {
        this.patientWeightRangeRunning = status;
    }

    getPatientWeightRangeRunning() {
        return this.patientWeightRangeRunning;
    }
    
    setSliceThicknessRangeRunning( status ) {
        this.sliceThicknessRangeRunning = status;
    }
    
    getSliceThicknessRangeRunning() {
        return this.sliceThicknessRangeRunning;
    }
    setImageDescriptionRunning( status ) {
        this.imageDescriptionRunning = status;
    }
    
    getImageDescriptionRunning() {
        return this.imageDescriptionRunning;
    }

    setPixelSpacingRangeRunning( status ) {
        this.pixelSpacingRangeRunning = status;
    }

    getPixelSpacingRangeRunning() {
        return this.pixelSpacingRangeRunning;
    }   

    setManufacturerRunning( status ) {
        this.manufacturerRunning = status;
    }   

    getManufacturerRunning() {
        return this.manufacturerRunning;
    }   

    setNbiaProgramRunning( status ) {
        this.nbiaProgramRunning = status;
    }

    getNbiaProgramRunning() {
        return this.nbiaProgramRunning;
    }

    setSubjectIdRunning( status ) {
        this.subjectIdRunning = status;
    }

    getSubjectIdRunning() {
        return this.subjectIdRunning;
    }   

    setSeriesCriteriaRunning( status ) {
        this.seriesCriteriaRunning = status;
    }

    getSeriesCriteriaRunning() {
        return this.seriesCriteriaRunning;
    }

    setStudyCriteriaRunning( status ) {
        this.studyCriteriaRunning = status;
    }

    getStudyCriteriaRunning() {
        return this.studyCriteriaRunning;
    }   

    getAnyRunning() {
        let res = false;
        if( this.collectionsRunning ){
            res = true;
        }
        if( this.modalityRunning ){
            res = true;
        }
        if( this.anatomicalSiteRunning ){
            res = true;
        }
        if( this.speciesRunning ){
            res = true;
        }
        if( this.phantomsRunning ){
            res = true;
        }
        if( this.thirdPartyRunning ){
            res = true;
        }
        if( this.excludeCommercialRunning ){
            res = true;
        }
        if( this.daysFromBaselineRunning ){
            res = true;
        }
        if( this.minimumStudiesRunning ){
            res = true;
        }
        if( this.dateRangeRunning ){
            res = true;
        }
        if( this.dateRangeRunning ){
            res = true;
        }
        if( this.patientAgeRangeRunning ){
            res = true;
        }
        if( this.patientSexRunning ){
            res = true;
        }

        if( this.patientHeightRangeRunning ){
            res = true;
        }

        if( this.patientWeightRangeRunning ){
            res = true;
        }
        
        if( this.sliceThicknessRangeRunning ){
            res = true;
        }
        
        if( this.imageDescriptionRunning ){
            res = true;
        }

        if( this.pixelSpacingRangeRunning ){
            res = true;
        }

        if( this.manufacturerRunning ){
            res = true;
        }  
        
        if( this.nbiaProgramRunning ){
            res = true;
        }

        if(this.subjectIdRunning) {
            res = true;
        }

        if(this.seriesCriteriaRunning) {
            res = true;
        }   

        if(this.studyCriteriaRunning) {
            res = true;
        }   
        
        return res;
    }
}
