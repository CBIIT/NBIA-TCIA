import { EventEmitter, Injectable } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { Properties } from '@assets/properties';
import { Consts, MenuItems } from '@app/consts';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { MenuService } from '@app/common/services/menu.service';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';
import { Subject } from 'rxjs';
import { QueryCriteriaInitService } from '@app/common/services/query-criteria-init.service';


/**
 * We will need to add some input validation
 */

@Injectable({
  providedIn: 'root'
})
export class ParameterService{
    parameterSubjectIdEmitter = new EventEmitter();
    parameterCollectionEmitter = new EventEmitter();
    parameterModalityEmitter = new EventEmitter();
    parameterAnatomicalSiteEmitter = new EventEmitter();
    parameterMinimumStudiesEmitter = new EventEmitter();
    parameterDateRangeEmitter = new EventEmitter();
    parameterSpeciesEmitter = new EventEmitter();
    parameterPhantomsEmitter = new EventEmitter();
    parameterThirdPartyEmitter = new EventEmitter();
    parameterExcludeCommercialEmitter = new EventEmitter();
    parameterDaysFromBaselineEmitter = new EventEmitter();
    parameterTextSearchEmitter = new EventEmitter();

    parameterPatientAgeRangeEmitter = new EventEmitter();
    parameterPatientSexEmitter = new EventEmitter();
    parameterPatientHeightRangeEmitter = new EventEmitter();
    parameterPatientWeightRangeEmitter = new EventEmitter();
    parameterSliceThicknessRangeEmitter = new EventEmitter();
    parameterImageDescriptionEmitter = new EventEmitter();
    parameterPixelSpacingRangeEmitter = new EventEmitter();

    parameterManufacturerEmitter = new EventEmitter();
    parameterNbiaProgramEmitter = new EventEmitter();

    parameterStudyCriteriaEmitter = new EventEmitter();
    parameterSeriesCriteriaEmitter = new EventEmitter();

    // Used for determining if cart from URL should be (re)loaded
    no = 0;
    yes = 1;
    seen = 2;

    patientID = '';  // Subject
    collections = '';
    modality = '';
    modalityAll = '';
    anatomicalSite = '';
    minimumStudies = 1;
    dateRange = '';
    species = '';
    phantoms = '';
    thirdParty = '';
    excludeCommercial = '';
    daysFromBaseline = '';
    showTest = false;
    apiUrl = '';

    patientAgeRange = '';
    patientSex = '';
    patientHeightRange = '';
    patientWeightRange = '';
    sliceThicknessRange = '';
    pixelSpacingRange = '';
    imageDescription = '';
    nbiaProgram = '';
    studyCriteria = '';
    seriesCriteria = '';

    manufacturer = '';

    textSearch = '';

    waitTime = 11;

    // TODO give this a better name.
    stillWaitingOnAtLeastOneComponent = 0;
    // TODO give this a better name.
    haveParametersToService = false;
    wereAnySimpleSearchParametersSent = false;
    wereTextSearchParametersSent = false;
    wasSharedListParameterSent = this.no;
    sharedListName = '';


    constructor( private commonService: CommonService, private initMonitorService: InitMonitorService,
                 private queryUrlService: QueryUrlService, private menuService: MenuService,
                 private loadingDisplayService: LoadingDisplayService, private queryCriteriaInitService: QueryCriteriaInitService ) {

    }

    reset() {
        this.haveParametersToService = false;
    }

    // TODO give this a better name.
    getParameterStatus() {
        return this.haveParametersToService;
    }

    haveUrlSimpleSearchParameters() {
        return this.wereAnySimpleSearchParametersSent;
    }


    haveUrlTextSearchParameters() {
        return this.wereTextSearchParametersSent;
    }

    async setTextSearch( userTextInput ) {
        this.textSearch = userTextInput;
        await this.commonService.sleep( this.waitTime );

        this.parameterTextSearchEmitter.emit( userTextInput );
        this.commonService.setResultsDisplayMode( Consts.TEXT_SEARCH );
    }

    getTextSearch() {
        return this.textSearch;
    }

    haveUrlSharedList() {
        return this.wasSharedListParameterSent;
    }

    setHaveUrlSharedList( state ) {
        this.wasSharedListParameterSent = state;
    }

    seenUrlSharedList() {
        this.wasSharedListParameterSent = this.seen;
    }


    async setMinimumStudies( minimumStudies ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.minimumStudies = minimumStudies;

        this.commonService.setMinimumMatchedStudiesValue( minimumStudies );
        // Wait for the Minimum Studies query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getMinimumStudiesInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterMinimumStudiesEmitter.emit( minimumStudies );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.decStillWaitingOnAtLeastOneComponent();
    }

    getMinimumStudies() {
        return this.minimumStudies;
    }

    // Subject ID
    async setPatientID( subjectId ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.patientID = subjectId;


        await this.commonService.sleep( 750 );
        //  await this.commonService.sleep( this.waitTime );


        this.parameterSubjectIdEmitter.emit( subjectId );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

        this.decStillWaitingOnAtLeastOneComponent();
    }

    getPatientID() {
        return this.patientID;
    }

    async setCollection( collection ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.collections = collection;

        // Wait for the Collections query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getCollectionsInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterCollectionEmitter.emit( collection );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

        this.decStillWaitingOnAtLeastOneComponent();
    }

    getCollection() {
        return this.collections;
    }

    async setModality( modality, modalityAll = null ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.modality = modality;
        this.modalityAll = modalityAll;

        // Wait for the Image Modality query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getModalityInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterModalityEmitter.emit( { modality, modalityAll } );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.decStillWaitingOnAtLeastOneComponent();
    }

    getModality() {
        return this.modality;
    }

    getModalityAll() {
        return this.modalityAll;
    }

    async setPhantoms( phantoms ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.phantoms = phantoms;

        // Wait for the phantom query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getPhantomsInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterPhantomsEmitter.emit( phantoms );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.decStillWaitingOnAtLeastOneComponent();
    }

    getPhantoms() {
        return this.phantoms;
    }

    async setThirdParty( thirdParty ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.thirdParty = thirdParty;

        // Wait for the thirdParty query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getThirdPartyInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterThirdPartyEmitter.emit( thirdParty );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.decStillWaitingOnAtLeastOneComponent();
    }

    getThirdParty() {
        return this.thirdParty;
    }

    async setExcludeCommercial( excludeCommercial ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.excludeCommercial = excludeCommercial;
        // Wait for the thirdParty query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getExcludeCommercialInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterExcludeCommercialEmitter.emit( excludeCommercial );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.decStillWaitingOnAtLeastOneComponent();

    }

    getExcludeCommercial() {
        return this.excludeCommercial;
    }

    async setDaysFromBaseline( daysFromBaseline ) {

        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.daysFromBaseline = daysFromBaseline;
        // Wait for the thirdParty query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getDaysFromBaselineInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterDaysFromBaselineEmitter.emit( daysFromBaseline );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.decStillWaitingOnAtLeastOneComponent();

    }

    getDaysFromBaseline() {
        return this.daysFromBaseline;
    }

    async setSpecies( species ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.species = species;

        // Wait for the species query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getSpeciesInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterSpeciesEmitter.emit( species );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.decStillWaitingOnAtLeastOneComponent();
    }

    getSpecies() {
        return this.species;
    }

    async setAnatomicalSite( anatomicalSite ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.anatomicalSite = anatomicalSite;

        // Wait for the Anatomical query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getAnatomicalSiteInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterAnatomicalSiteEmitter.emit( anatomicalSite );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.decStillWaitingOnAtLeastOneComponent();
    }

    getAnatomicalSite() {
        return this.anatomicalSite;
    }

    async setDateRange( dateRange ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.dateRange = dateRange;

        // Wait for the DateRange query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getDateRangeInit() ){
            await this.commonService.sleep( this.waitTime );
        }


        let regexp = new RegExp( '^((0[1-9])|(1[0-2]))/([0-3][0-9])/(19|20)[0-9][0-9]-((0[1-9])|(1[0-2]))/([0-3][0-9])/(19|20)[0-9][0-9]$' );
        if( regexp.test( dateRange ) ){
            this.parameterDateRangeEmitter.emit( dateRange );
        }else{
            alert( 'Bad date range:\n' + dateRange );
        }
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.decStillWaitingOnAtLeastOneComponent();
    }

    getDateRange() {
        return this.dateRange;
    }

    async setPatientSex( patientSex ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.patientSex = patientSex;

        // Wait for the Patient sex query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getPatientSexInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterPatientSexEmitter.emit( patientSex );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.decStillWaitingOnAtLeastOneComponent();
    }
    getPatientSex(){
        return this.patientSex;
    }

    async setPatientAgeRange( patientAgeRange ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.patientAgeRange = patientAgeRange;

        // Wait for the Patient Age query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getPatientAgeRangeInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterPatientAgeRangeEmitter.emit( patientAgeRange );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

        this.decStillWaitingOnAtLeastOneComponent();
    }

    getPatientAgeRange() {
        return this.patientAgeRange;
    }

    async setSliceThicknessRange( sliceThicknessRange ) { 
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.sliceThicknessRange = sliceThicknessRange;

        // Wait for the Slice Thickness query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getSliceThicknessRangeInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterSliceThicknessRangeEmitter.emit( sliceThicknessRange );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

        this.decStillWaitingOnAtLeastOneComponent();  
    }

    getSliceThicknessRange() {
        return this.sliceThicknessRange;
    }

    async setPatientHeightRange( patientHeightRange ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.patientHeightRange = patientHeightRange;

        // Wait for the Patient Height query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getPatientHeightRangeInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterPatientHeightRangeEmitter.emit( patientHeightRange );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

        this.decStillWaitingOnAtLeastOneComponent();
    }

    getPatientHeightRange() {
        return this.patientHeightRange;
    }

    async setPatientWeightRange( patientWeightRange ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.patientWeightRange = patientWeightRange;

        // Wait for the Patient Weight query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getPatientWeightRangeInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterPatientWeightRangeEmitter.emit( patientWeightRange );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

        this.decStillWaitingOnAtLeastOneComponent();
    }
    getPatientWeightRange() {   
        return this.patientWeightRange;
    }

    async setPixelSpacingRange( pixelSpacingRange ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.pixelSpacingRange = pixelSpacingRange;

        // Wait for the Pixel Spacing query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getPixelSpacingRangeInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterPixelSpacingRangeEmitter.emit( pixelSpacingRange );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

        this.decStillWaitingOnAtLeastOneComponent();  
    }

    getPixelSpacingRange() {
        return this.pixelSpacingRange;
    }

    async setManufacturer( manufacturer ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.manufacturer = manufacturer;

        // Wait for the Manufacturer query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getManufacturerInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterManufacturerEmitter.emit( manufacturer );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

        this.decStillWaitingOnAtLeastOneComponent();  
    }

    getManufacturer() {
        return this.manufacturer;
    }

    async setImageDescription( imageDescription ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.imageDescription = imageDescription;

        // Wait for the Image Description query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getImageDescriptionInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterImageDescriptionEmitter.emit( imageDescription );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

        this.decStillWaitingOnAtLeastOneComponent();  
    }   

    getImageDescription() {
        return this.imageDescription;
    }

    async setNbiaProgram( nbiaProgram ) {
        this.incStillWaitingOnAtLeastOneComponent();
        this.haveParametersToService = true;
        this.wereAnySimpleSearchParametersSent = true;
        this.nbiaProgram = nbiaProgram;

        // Wait for the Nbia Program query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getNbiaProgramInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterNbiaProgramEmitter.emit( nbiaProgram );
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

        this.decStillWaitingOnAtLeastOneComponent();  
    }

    getNbiaProgram() {
        return this.nbiaProgram;
    }

    setStudyCriteria( studyCriteria ) { 
        this.studyCriteria = studyCriteria;
        this.parameterStudyCriteriaEmitter.emit( studyCriteria );
    }

    getStudyCriteria() {
        return this.studyCriteria;
    }

    setSeriesCriteria( seriesCriteria ) {
        this.seriesCriteria = seriesCriteria;
        this.parameterSeriesCriteriaEmitter.emit( seriesCriteria );
    }   

    getSeriesCriteria() {
        return this.seriesCriteria;
    }

    setShowTest( showTest ) {
        this.showTest = showTest;
        Properties.SHOW_TEST_TAB = showTest;
    }

    setApiUrl( apiUrl ) {
        this.apiUrl = apiUrl;
        Properties.API_SERVER_URL = apiUrl;
        // Update the query URL
        this.queryUrlService.update( this.queryUrlService.API_URL, apiUrl );
    }

    getSharedListName() {
        return this.sharedListName;
    }

    setSharedListName( sharedList ) {
        this.wasSharedListParameterSent = this.yes;
        this.sharedListName = sharedList;
        // We need a small delay here.  TODO explain
        setTimeout( () => {
            this.menuService.setCurrentItem( MenuItems.CART_MENU_ITEM );
        }, 500 );
    }


    async resetUrlQuery() {
        this.parameterMinimumStudiesEmitter.emit( this.minimumStudies );

        if( this.collections.length > 0 ){
            this.parameterCollectionEmitter.emit( this.collections );
        }

        if( this.patientID.length > 0 ){
            this.parameterSubjectIdEmitter.emit( this.patientID );
        }

        if( this.anatomicalSite.length > 0 ){
            this.parameterAnatomicalSiteEmitter.emit( this.anatomicalSite );
        }

        if( this.species.length > 0 ){
            this.parameterSpeciesEmitter.emit( this.species );
        }

        if( this.phantoms.length > 0 ){
            this.parameterPhantomsEmitter.emit( this.phantoms );
        }

        if( this.thirdParty.length > 0 ){
            this.parameterThirdPartyEmitter.emit( this.thirdParty );
        }

        if( this.excludeCommercial.length > 0 ){
            this.parameterExcludeCommercialEmitter.emit( this.excludeCommercial );
        }

        if( this.daysFromBaseline.length > 0 ){
            this.parameterDaysFromBaselineEmitter.emit( this.daysFromBaseline );
        }

        if( this.dateRange.length > 0 ){
            let regexp = new RegExp( '^((0[1-9])|(1[0-2]))/([0-3][0-9])/(19|20)[0-9][0-9]-((0[1-9])|(1[0-2]))/([0-3][0-9])/(19|20)[0-9][0-9]$' );
            if( regexp.test( this.dateRange ) ){
                this.parameterDateRangeEmitter.emit( this.dateRange );
            }else{
                console.error( 'Bad date range in URL parameter: ', this.dateRange );
            }
        }

        if( this.modality.length > 0 ){
            this.parameterModalityEmitter.emit( { modality: this.modality, modalityAll: this.modalityAll } );
        }

        if( this.patientAgeRange.length > 0 ){
            this.parameterPatientAgeRangeEmitter.emit( this.patientAgeRange );
        }

        if( this.patientSex.length > 0 ){
            this.parameterPatientSexEmitter.emit( this.patientSex );
        }

        if( this.sliceThicknessRange.length > 0 ){
            this.parameterSliceThicknessRangeEmitter.emit( this.sliceThicknessRange );
        }

        if( this.pixelSpacingRange.length > 0 ){
            this.parameterPixelSpacingRangeEmitter.emit( this.pixelSpacingRange );
        }

        if( this.imageDescription.length > 0 ){
            this.parameterImageDescriptionEmitter.emit( this.imageDescription );
        }   

        if( this.manufacturer.length > 0 ){
            this.parameterManufacturerEmitter.emit( this.manufacturer );        
        }

        if( this.nbiaProgram.length > 0 ){
            this.parameterNbiaProgramEmitter.emit( this.nbiaProgram );
        }

        if( this.studyCriteria.length > 0 ){
            this.parameterStudyCriteriaEmitter.emit( this.studyCriteria );
        }

        if( this.seriesCriteria.length > 0 ){
            this.parameterSeriesCriteriaEmitter.emit( this.seriesCriteria );
        }

        // We may need to wait here to give the criteria components time to populate.
        await this.commonService.sleep( 200 ); // FIXME Testing...
        this.commonService.runSearchForUrlParameters();
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

    }



    //
    /**
     * @TODO give this a better name
     * @CHECKME - We may need to add safeguard - Is it possible, one component can start and complete before one or more others have started,
     *  CHECKME - resulting in this.stillWaitingOnAtLeastOneComponent being zero before we are really done?
     */
    decStillWaitingOnAtLeastOneComponent() {
        this.stillWaitingOnAtLeastOneComponent--;

        if( this.stillWaitingOnAtLeastOneComponent < 1 ){
            this.doUrlSearch();
        }
    }

    async doUrlSearch() {
        this.loadingDisplayService.setLoading( true, 'Updating Counts' );
        while( ! this.queryCriteriaInitService.isQueryCriteriaInitComplete() ){
            await this.commonService.sleep( this.waitTime );
        }

        this.reset();
        this.commonService.runSearchForUrlParameters();
        this.loadingDisplayService.setLoading( false );
    }

    incStillWaitingOnAtLeastOneComponent() {
        this.stillWaitingOnAtLeastOneComponent++;
    }

}
