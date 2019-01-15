import { EventEmitter, Injectable } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { Properties } from '@assets/properties';
import { Consts, MenuItems } from '@app/consts';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { MenuService } from '@app/common/services/menu.service';


/**
 * We will need to add some input validation
 */

@Injectable()
export class ParameterService{
    parameterSubjectIdEmitter = new EventEmitter();
    parameterCollectionEmitter = new EventEmitter();
    parameterModalityEmitter = new EventEmitter();
    parameterAnatomicalSiteEmitter = new EventEmitter();
    parameterMinimumStudiesEmitter = new EventEmitter();
    parameterDateRangeEmitter = new EventEmitter();
    parameterTextSearchEmitter = new EventEmitter();

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
    showTest = false;
    apiUrl = '';

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
                 private queryUrlService: QueryUrlService, private menuService: MenuService ) {
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

        this.commonService.setMinimumMatchedStudiesValue( +minimumStudies );
        // Wait for the Minimum Studies query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getMinimumStudiesInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        this.parameterMinimumStudiesEmitter.emit( +minimumStudies );
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

    async resetUrlQuery() {
        this.parameterMinimumStudiesEmitter.emit( +this.minimumStudies );

        if( this.collections.length > 0 ){
            this.parameterCollectionEmitter.emit( this.collections );
        }

        if( this.patientID.length > 0 ){
            this.parameterSubjectIdEmitter.emit( this.patientID );
        }

        if( this.anatomicalSite.length > 0 ){
            this.parameterAnatomicalSiteEmitter.emit( this.anatomicalSite );
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

        // We may need to wait here to give the criteria components time to populate.
        await this.commonService.sleep( 200 ); // FIXME Testing...
        this.commonService.runSearchForUrlParameters();
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );

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

        // Wait for the Anatomical query component to be initialized so it can use this parameter.
        while( !this.initMonitorService.getDateRangeInit() ){
            await this.commonService.sleep( this.waitTime );
        }
        let regexp = new RegExp( '^((0[1-9])|(1[0-2]))/([0-3][0-9])/(19|20)[0-9][0-9]-((0[1-9])|(1[0-2]))/([0-3][0-9])/(19|20)[0-9][0-9]$' );
        if( regexp.test( dateRange ) ){
            this.parameterDateRangeEmitter.emit( dateRange );
        }
        else{
            alert( 'Bad date range:\n' + dateRange );
        }
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.decStillWaitingOnAtLeastOneComponent();
    }

    getDateRange() {
        return this.dateRange;
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

    //
    /**
     * @TODO give this a better name
     * @CHECKME - We may need to add safeguard - Is it possible, one component can start and complete before one or more others have started,
     *  CHECKME - resulting in this.stillWaitingOnAtLeastOneComponent being zero before we are really done?
     */
    decStillWaitingOnAtLeastOneComponent() {
        this.stillWaitingOnAtLeastOneComponent--;

        if( this.stillWaitingOnAtLeastOneComponent < 1 ){
            this.reset();
            this.commonService.runSearchForUrlParameters();
        }
    }

    incStillWaitingOnAtLeastOneComponent() {
        this.stillWaitingOnAtLeastOneComponent++;
    }

}
