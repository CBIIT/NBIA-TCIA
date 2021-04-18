import { EventEmitter, Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { ParameterService } from './parameter.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { Consts, TokenStatus } from '@app/constants';
import { Properties } from '@assets/properties';
import { AccessTokenService } from './access-token.service';
import { Observable, of } from 'rxjs';
import { LoadingDisplayService } from '@app/admin-common/components/loading-display/loading-display.service';
import { DisplayDynamicQueryService } from '@app/tools/display-dynamic-query/display-dynamic-query/display-dynamic-query.service';
import { DynamicQueryBuilderService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-builder.service';

@Injectable( {
    providedIn: 'root'
} )
export class ApiService{
    userRoles;
    collectionSiteNames;
    collectionNames;
    collectionDescriptions;
    collectionLicenses;
    collectionSitesAndDescriptions = [];
    collectionsAndDescriptions = [];

    updatedUserRolesEmitter = new EventEmitter();
    updatedUserRolesErrorEmitter = new EventEmitter();
    collectionSitesAndDescriptionEmitter = new EventEmitter();
    collectionsAndDescriptionEmitter = new EventEmitter();

    // When a QC Tools or Approve Deletion search is run, it emits the Collection//Site to the search
    // results so we can Show the Collection in the results, but not get it back from the server with each row of results.
    collectionSiteEmitter = new EventEmitter();

    searchResultsEmitter = new EventEmitter();
    resultsErrorEmitter = new EventEmitter();

    collectionLicensesResultsEmitter = new EventEmitter();
    collectionLicensesErrorEmitter = new EventEmitter();

    qcHistoryResultsEmitter = new EventEmitter();
    qcHistoryErrorEmitter = new EventEmitter();

    qcHistoryResultsTableEmitter = new EventEmitter();
    qcHistoryTableErrorEmitter = new EventEmitter();

    visibilitiesEmitter = new EventEmitter();
    visibilitiesErrorEmitter = new EventEmitter();

    seriesForDeletionEmitter = new EventEmitter();
    seriesForDeletionErrorEmitter = new EventEmitter();

    submitCollectionLicenseResultsEmitter = new EventEmitter();
    submitCollectionLicenseErrorEmitter = new EventEmitter();

    submitDeleteLicenseResultsEmitter = new EventEmitter();
    submitDeleteLicenseErrorEmitter = new EventEmitter();

    submitBulkQcResultsEmitter = new EventEmitter();
    submitBulkQcErrorEmitter = new EventEmitter();

    submitSeriesDeletionResultsEmitter = new EventEmitter();
    submitSeriesDeletionErrorEmitter = new EventEmitter();

    submitOnlineDeletionResultsEmitter = new EventEmitter();
    submitOnlineDeletionErrorEmitter = new EventEmitter();

    getDicomImageErrorEmitter = new EventEmitter();

    getDynamicCriteriaSelectionMenuDataResultsEmitter = new EventEmitter();
    getDynamicCriteriaSelectionMenuDataErrorEmitter = new EventEmitter();

    constructor( private utilService: UtilService, private parameterService: ParameterService,
                 private httpClient: HttpClient, private accessTokenService: AccessTokenService,
                 private loadingDisplayService: LoadingDisplayService, private displayDynamicQueryService: DisplayDynamicQueryService) {

        this.init();

    }

    async init() {
        // Wait until we are sure we have the access token (if there is one).
        while( !this.parameterService.haveParameters() ){
            await this.utilService.sleep( Consts.waitTime );
        }
        this.update();

        while( this.accessTokenService.getAccessToken() === undefined ){
            await this.utilService.sleep( Consts.waitTime );
        }
        this.getWikiUrlParam();
    }

    update() {
        this.getRoles();
    }

    // TODO rename this, we use it for queries too that are not from that left side Criteria search.
    // This method is not really necessary
    doSubmit( tool, submitData ) {
        switch( tool ){
            case Consts.TOOL_BULK_QC:
                this.submitBulkQc( submitData );
                break;

            case Consts.TOOL_EDIT_LICENSE:
                this.submitCollectionLicense( submitData );
                break;

            case Consts.SUBMIT_DELETE_COLLECTION_LICENSES:
                this.submitDeleteLicense( submitData );
                break;

            case Consts.GET_HISTORY_REPORT:
                this.getQcHistoryReport( submitData );
                break;

            case Consts.GET_HISTORY_REPORT_TABLE:
                this.getQcHistoryReportTable( submitData );
                break;

            case Consts.TOOL_APPROVE_DELETIONS:
                this.submitBulkDeletion( submitData );
                break;

            case Consts.GET_SERIES_FOR_DELETION:
                this.getSeriesForDeletion();
                break;

        }
    }

    /**
     * Used by criteria search for Perform QC and Approve Deletions.
     *
     * @param tool
     * @param queryData
     */
    doCriteriaSearchQuery( tool, queryData ) {
        let queryParameters = '';
        // SUBMIT_QC_STATUS_UPDATE
        // Build the correctly formatted query for the rest call here.
        for( let element of queryData ){

            switch( element['criteria'] ){
                case Consts.QUERY_CRITERIA_QC_STATUS:
                    if( tool === Consts.TOOL_PERFORM_QC ){
                        for( let status of element['displayData'] ){
                            queryParameters += '&visibilities=' + status;
                        }
                    }
                    break;

                case Consts.QUERY_CRITERIA_COLLECTION:
                    if( tool === Consts.TOOL_APPROVE_DELETIONS ||
                        tool === Consts.TOOL_PERFORM_QC
                    ){
                        queryParameters += '&collectionSite=' + element['data'];
                    }
                    break;

                case Consts.QUERY_CRITERIA_MOST_RECENT_SUBMISSION:
                    if( tool === Consts.TOOL_APPROVE_DELETIONS ||
                        tool === Consts.TOOL_PERFORM_QC
                    ){
                        let dates = element['data'].split( ',' );
                        queryParameters += '&fromDate=' + dates[0];
                        queryParameters += '&toDate=' + dates[1];
                    }
                    break;

                case Consts.QUERY_CRITERIA_BATCH_NUMBER:
                    if( tool === Consts.TOOL_APPROVE_DELETIONS ||
                        tool === Consts.TOOL_PERFORM_QC
                    ){
                        queryParameters += '&batch=' + element['data'];
                    }
                    break;

                case Consts.QUERY_CRITERIA_RELEASED:
                    if( tool === Consts.TOOL_APPROVE_DELETIONS ||
                        tool === Consts.TOOL_PERFORM_QC
                    ){
                        if( element['data'] === 1 ){
                            queryParameters += '&released=No';
                        }else{
                            queryParameters += '&released=Yes';
                        }
                    }
                    break;

                case Consts.QUERY_CRITERIA_CONFIRMED_COMPLETE:
                    if( tool === Consts.TOOL_APPROVE_DELETIONS ||
                        tool === Consts.TOOL_PERFORM_QC
                    ){
                        if( element['data'] === 1 ){
                            queryParameters += '&confirmedComplete=No';
                        }else{
                            queryParameters += '&confirmedComplete=Complete';
                        }
                    }
                    break;

                case Consts.QUERY_CRITERIA_SUBJECT_ID:
                    if( tool === Consts.TOOL_APPROVE_DELETIONS ||
                        tool === Consts.TOOL_PERFORM_QC
                    ){
                        for( let id of element['data'] ){
                            queryParameters += '&subjectIds=' + id;
                        }
                    }
                    break;
            }
        }

        if( tool === Consts.TOOL_APPROVE_DELETIONS ){
            // Do the search.
            this.getApproveDeletionsSearch( queryParameters.substr( 1 ) );
        }

        if( tool === Consts.TOOL_PERFORM_QC ){
            // Do the search if we have at least one QC Status.
            if( queryParameters.includes( '&visibilities=' ) ){
                this.getPerformQcSearch( queryParameters.substr( 1 ) );
            }else{
                // Don't do the search, and send back Consts.NO_SEARCH, this will tell the Searchresults screen don't show results count or pager at the topv(not the same as a search with no results).
                this.searchResultsEmitter.emit( [Consts.NO_SEARCH] );
            }
        }
    }

    submitBulkQc( query ) {
        this.doPost( Consts.SUBMIT_QC_STATUS_UPDATE, query ).subscribe(
            ( data ) => {
                this.submitBulkQcResultsEmitter.emit( data );
            },
            ( err ) => {
                this.submitBulkQcErrorEmitter.emit( err );
                console.error( 'submitBulkQc err: ', err['error'] );
                console.error( 'submitBulkQc err: ', err );
            } );
    }

    submitCollectionLicense( query ) {
        this.doPost( Consts.SUBMIT_COLLECTION_LICENSES, query ).subscribe(
            ( data ) => {
                this.submitCollectionLicenseResultsEmitter.emit( data );
            },
            ( err ) => {
                this.submitCollectionLicenseErrorEmitter.emit( err );
                console.error( 'submitCollectionLicense err: ', err['error'] );
                console.error( 'submitCollectionLicense err: ', err );
            } );
    }

    submitDeleteLicense( lic ) {
        let deleteLicenseQuery = 'id=' + lic;
        this.doPost( Consts.SUBMIT_DELETE_COLLECTION_LICENSES, deleteLicenseQuery ).subscribe(
            ( data ) => {
                this.submitDeleteLicenseResultsEmitter.emit( data );
            },
            ( err ) => {
                this.submitDeleteLicenseErrorEmitter.emit( err );
            } );
    }

    getDynamicCriteriaSelectionMenuData() {
        this.doGet( Consts.GET_DYNAMIC_CRITERIA_SELECTION_MENU_DATA ).subscribe(
            ( data ) => {
                this.getDynamicCriteriaSelectionMenuDataResultsEmitter.emit( data );
            },
            async( err ) => {
                if( err.status === 401 ){
                    // If there is no user name or pass word, the refresh token will be used
                    this.accessTokenService.getAccessTokenFromServer( this.accessTokenService.getCurrentUser(), this.accessTokenService.getCurrentPassword() );
                    while( this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ){
                        await this.utilService.sleep( Consts.waitTime );
                    }

                    // Have new token try again
                    this.doGet( Consts.GET_DYNAMIC_CRITERIA_SELECTION_MENU_DATA ).subscribe(
                        ( data0 ) => {
                            this.getDynamicCriteriaSelectionMenuDataResultsEmitter.emit( data0 );
                        },
                        ( err0 ) => {
                            this.getDynamicCriteriaSelectionMenuDataErrorEmitter.emit( err0 );
                            this.loadingDisplayService.setLoading( false );
                            console.error( 'Server error: ' + err.statusText + ' (' + err['status'] + ') - ' + err.error['error'] );
                            alert( 'Server error: ' + err.statusText + ' (' + err['status'] + ') - ' + err.error['error'] );
                        } );
                }

                // END error 401
                else{
                    this.getDynamicCriteriaSelectionMenuDataErrorEmitter.emit( err );
                    this.loadingDisplayService.setLoading( false );
                    console.error( 'Server error: ' + err.statusText + ' (' + err['status'] + ') - ' + err.error );
                    alert( 'Server error: ' + err.statusText + ' (' + err['status'] + ') - ' + err.error );
                }

                console.error( 'ERROR GET_DYNAMIC_CRITERIA_SELECTION_MENU_DATA: ', err );
                this.getDynamicCriteriaSelectionMenuDataErrorEmitter.emit( err );
            } );
    }

    submitBulkDeletion( query ) {
        this.doPost( Consts.SUBMIT_SERIES_DELETION, query ).subscribe(
            ( data ) => {
                this.submitSeriesDeletionResultsEmitter.emit( data );
            },
            ( err ) => {
                this.submitSeriesDeletionErrorEmitter.emit( err );
                console.error( 'submitBulkDeletion err: ', err['error'] );
                console.error( 'submitBulkDeletion err: ', err );
            } );
    }

    submitOnlineDeletion() {
        this.doPost( Consts.SUBMIT_ONLINE_DELETION, 'deletion=online' ).subscribe(
            ( data ) => {
                this.submitOnlineDeletionResultsEmitter.emit( data );
            },
            ( err ) => {
                this.submitOnlineDeletionErrorEmitter.emit( err );
                console.error( 'submitOnlineDeletion err: ', err['error'] );
                console.error( 'submitOnlineDeletion err: ', err );
            } );
    }


// SUBMIT_ONLINE_DELETION
    getSeriesForDeletion() {
        this.doGet( Consts.GET_SERIES_FOR_DELETION ).subscribe(
            ( data ) => {
                this.seriesForDeletionEmitter.emit( data );
            },
            ( err ) => {
                this.seriesForDeletionErrorEmitter.emit( err );
                console.error( 'seriesForDeletion err: ', err['error'] );
                console.error( 'seriesForDeletion err: ', err );
            } );
    }

    getQcHistoryReport( query ) {
        this.doPost( Consts.GET_HISTORY_REPORT, query ).subscribe(
            ( data ) => {
                this.qcHistoryResultsEmitter.emit( data );
            },
            ( err ) => {
                this.qcHistoryErrorEmitter.emit( err );
                console.error( 'getQcHistoryReport err: ', err['error'] );
                console.error( 'getQcHistoryReport err: ', err );
            } );
    }

    getQcHistoryReportTable( query ) {
        this.doPost( Consts.GET_HISTORY_REPORT, query ).subscribe(
            ( data ) => {
                this.qcHistoryResultsTableEmitter.emit( data );
            },
            ( err ) => {
                this.qcHistoryTableErrorEmitter.emit( err );
                console.error( 'getQcHistoryReportTable err: ', err['error'] );
                console.error( 'getQcHistoryReportTable err: ', err );
            } );

    }

    async getVisibilities() {
        while(
            this.accessTokenService.getAccessTokenStatus() === -1 ||
            this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ||
            this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN
            ){
            await this.utilService.sleep( Consts.waitTime );
        }

        this.doGet( Consts.GET_VISIBILITIES ).subscribe(
            ( data ) => {
                this.visibilitiesEmitter.emit( data );
            },
            ( err ) => {
                this.visibilitiesErrorEmitter.emit( err );
                console.error( 'getVisibilities err: ', err['error'] );
                console.error( 'getVisibilities err: ', err );
            } );

    }

    getApproveDeletionsSearch( query ) {
        // Send the Collection//Site so it doesn't need to bi included in the search results
        this.collectionSiteEmitter.emit( query.replace( /^.*collectionSite=/, '' ).replace( /&.*$/, '' ) );
        this.doPost( Consts.GET_SEARCH_FOR_APPROVE_DELETIONS, query ).subscribe(
            ( approveDeletionsSearchData ) => {
                // CHECKME I am switching this function to use the same emitter as PreformQc, should work. - Looks like it worked check again...
                this.searchResultsEmitter.emit( approveDeletionsSearchData );
            },
            async approveDeletionsSearchDataError => {

                // Token has expired, try to get a new one
                if( approveDeletionsSearchDataError['status'] === 401 ){
                    this.accessTokenService.getAccessTokenFromServer( this.accessTokenService.getCurrentUser(), this.accessTokenService.getCurrentPassword() );
                    while( this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ){
                        await this.utilService.sleep( Consts.waitTime );
                    }
                    this.doPost( Consts.GET_SEARCH_FOR_APPROVE_DELETIONS, query ).subscribe(
                        approveDeletionsSearchData0 => {
                            this.searchResultsEmitter.emit( approveDeletionsSearchData0 );
                        },
                        performQcSearchDataError0 => {
                            this.resultsErrorEmitter.emit( performQcSearchDataError0 );
                        } );
                }else{

                    this.resultsErrorEmitter.emit( approveDeletionsSearchDataError );
                    console.error( 'Could not get ApproveDeletionsSearch from server: ', approveDeletionsSearchDataError );
                }
            } );
    }

    /**
     *  TODO these methods need more consistent names
     *  TODO add Error reaction
     *
     * For Dynamic criteria search
     *
     * @param query
     */
    doAdvancedQcSearch( query ) {
        this.displayDynamicQueryService.query( query );

        this.loadingDisplayService.setLoading( true, 'Loading data...' );

        // Check for empty query. If empty just send Consts.NO_SEARCH, this will tell search results component not to show count and pager etc. at the top
        if( query === undefined || query.length < 1 ){
            this.searchResultsEmitter.emit( [Consts.NO_SEARCH] );
            return;
        }


        // We don't know if Collection was a query criteria, so only send it if it is.
        if( query.includes( 'collectionSite=' ) ){
            this.collectionSiteEmitter.emit( query.replace( /^.*collectionSite=/, '' ).replace( /&.*$/, '' ) );
        }else{
            this.collectionSiteEmitter.emit( '' );
        }

        this.doPost( Consts.GET_ADVANCED_QC_SEARCH, query ).subscribe(
            ( performAdvancedQcSearchData ) => {
                this.searchResultsEmitter.emit( performAdvancedQcSearchData );
            },
            async( performAdvancedQcSearchDataError ) => {

                // Token has expired, try to get a new one
                if( performAdvancedQcSearchDataError['status'] === 401 ){

                    // If there is no user name and pass word, the refresh token will be used
                    this.accessTokenService.getAccessTokenFromServer( this.accessTokenService.getCurrentUser(), this.accessTokenService.getCurrentPassword() );
                    while( this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ){
                        await this.utilService.sleep( Consts.waitTime );
                    }

                    this.doPost( Consts.GET_ADVANCED_QC_SEARCH, query ).subscribe(
                        performAdvancedQcSearchData0 => {
                            this.searchResultsEmitter.emit( performAdvancedQcSearchData0 );
                        },
                        performAdvancedQcSearchDataError0 => {
                            this.resultsErrorEmitter.emit( performAdvancedQcSearchDataError0 );
                            this.loadingDisplayService.setLoading( false );
                            console.error( 'Server error: ' + performAdvancedQcSearchDataError.statusText + ' (' + performAdvancedQcSearchDataError['status'] + ') - ' + performAdvancedQcSearchDataError.error );
                            alert( 'Server error: ' + performAdvancedQcSearchDataError.statusText + ' (' + performAdvancedQcSearchDataError['status'] + ') - ' + performAdvancedQcSearchDataError.error );
                        } );
                }
                // END if 401
                else{
                    this.resultsErrorEmitter.emit( performAdvancedQcSearchDataError );
                    this.loadingDisplayService.setLoading( false );
                    console.error( 'Server error: ' + performAdvancedQcSearchDataError.statusText + ' (' + performAdvancedQcSearchDataError['status'] + ') - ' + performAdvancedQcSearchDataError.error );
                    alert( 'Server error: ' + performAdvancedQcSearchDataError.statusText + ' (' + performAdvancedQcSearchDataError['status'] + ') - ' + performAdvancedQcSearchDataError.error );
                }
            } );
    }

    /**
     *  TODO these methods need more consistent names
     * @param query
     */
    getPerformQcSearch( query ) {
        this.collectionSiteEmitter.emit( query.replace( /^.*collectionSite=/, '' ).replace( /&.*$/, '' ) );
        this.doPost( Consts.GET_SEARCH_FOR_PERFORM_QC, query ).subscribe(
            ( performQcSearchData ) => {
                this.searchResultsEmitter.emit( performQcSearchData );
            },
            async performQcSearchDataError => {

                // Token has expired, try to get a new one
                if( performQcSearchDataError['status'] === 401 ){

                    // If we have a user name and password use that
                    this.accessTokenService.getAccessTokenFromServer( this.accessTokenService.getCurrentUser(), this.accessTokenService.getCurrentPassword() );
                    while( this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ){
                        await this.utilService.sleep( Consts.waitTime );
                    }

                    // Try the query again
                    this.doPost( Consts.GET_SEARCH_FOR_PERFORM_QC, query ).subscribe(
                        performQcSearchData0 => {
                            this.searchResultsEmitter.emit( performQcSearchData0 );
                        },
                        performQcSearchDataError0 => {
                            this.resultsErrorEmitter.emit( performQcSearchDataError0 );
                        } );
                }
                // END error 401
                else{
                    this.resultsErrorEmitter.emit( performQcSearchDataError );
                    console.error( 'Server error: ' + performQcSearchDataError.statusText + ' [' + performQcSearchDataError['status'] + '] - ' + performQcSearchDataError.error );
                }
            } );
    }

    setNoSearch() {
        this.searchResultsEmitter.emit( [Consts.NO_SEARCH] );
    }

    async getWikiUrlParam() {
        while(
            this.accessTokenService.getAccessTokenStatus() === -1 ||
            this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ||
            this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN
            ){
            // console.log( 'MHL 003 getWikiUrlParam getAccessTokenStatus: ', this.accessTokenService.getAccessTokenStatus() );
            await this.utilService.sleep( Consts.waitTime );
        }
        this.doGet( Consts.GET_CONFIG_PARAMS ).subscribe(
            ( data ) => {
                for( let param of data ){
                    if( param['paramName'].match( '^\s*wikiBaseUrl\s*$' ) ){
                        Properties.HELP_BASE_URL = param['paramValue'];
                    }
                }
            },
            getParamsError => {
                console.error( 'Error: ', getParamsError );
                console.error( 'Could not get help base url from server using default: ', Properties.HELP_BASE_URL );
            }
        );
    }

    getCollectionAndDescriptions() {
        this.doGet( Consts.GET_COLLECTION_DESCRIPTIONS ).subscribe(
            ( collectionDescriptionsData ) => {
                this.collectionDescriptions = collectionDescriptionsData;
                this.getCollectionNames();
            },
            collectionAndDescriptionsError => {
                if( collectionAndDescriptionsError.status === 401 ){
                    this.userRoles = [Consts.ERROR_401];
                }else{
                    console.error( 'Could not get CollectionDescriptions from server: ', collectionAndDescriptionsError );
                    this.userRoles = [Consts.ERROR, collectionAndDescriptionsError.status];
                }
            } );
    }


    getCollectionSiteAndDescriptions() {
        this.doGet( Consts.GET_COLLECTION_DESCRIPTIONS ).subscribe(
            ( collectionDescriptionsData ) => {
                this.collectionDescriptions = collectionDescriptionsData;
                // this.getCollectionNames();
                this.getCollectionSitesAndDescription();
            },
            collectionDescriptionsError => {
                if( collectionDescriptionsError.status === 401 ){
                    this.userRoles = [Consts.ERROR_401];
                }else{
                    console.error( 'Could not get CollectionDescriptions from server: ', collectionDescriptionsError );
                    this.userRoles = [Consts.ERROR, collectionDescriptionsError.status];
                }

            } );
    }

    getCollectionLicenses() {
        this.doGet( Consts.GET_COLLECTION_LICENSES ).subscribe(
            ( collectionLicensesData ) => {
                this.collectionLicenses = collectionLicensesData;
                // Emit here
                this.collectionLicensesResultsEmitter.emit( this.collectionLicenses );
            },
            collectionLicensesError => {
                if( collectionLicensesError.status === 401 ){
                    this.userRoles = [Consts.ERROR_401];
                }else{
                    console.error( 'Could not get Collection licenses from server: ', collectionLicensesError );
                    this.userRoles = [Consts.ERROR, collectionLicensesError.status];
                }

            } );
    }

    getCollectionSitesAndDescription() {
        this.doGet( Consts.GET_COLLECTION_NAMES_AND_SITES ).subscribe(
            collectionNamesData => {
                this.collectionSiteNames = collectionNamesData;
                this.mergeCollectionSitesAndDescriptions();
            },
            ( collectionNamesError ) => {
                if( collectionNamesError.status === 401 ){
                    this.userRoles = [Consts.ERROR_401];
                }else{
                    this.userRoles = [Consts.ERROR, collectionNamesError.status];
                }
            } );
    }

    getDicomData( image ) {

    }


    /**
     * Collection names without sites.
     */
    getCollectionNames() {
        if( this.utilService.isNullOrUndefinedOrEmpty( this.accessTokenService.getAccessToken() ) ){
            this.userRoles = [Consts.ERROR, -1];
        }else{
            this.doGet( Consts.GET_COLLECTION_NAMES ).subscribe(
                collectionNamesData => {
                    this.collectionNames = collectionNamesData;
                    this.mergeCollectionsAndDescriptions()
                },
                ( collectionNamesError ) => {
                    if( collectionNamesError.status === 401 ){
                        this.userRoles = [Consts.ERROR_401];
                    }else{
                        console.error( 'Could not get collection names from server: ', collectionNamesError );
                        this.userRoles = [Consts.ERROR, collectionNamesError.status];
                    }
                } );
        }
    }

    mergeCollectionsAndDescriptions() {
        for( let name of this.collectionNames ){
            let temp = { 'name': name['criteria'] };
            temp['description'] = '';
            temp['id'] = -1;

            // See if we can find a description for the collection name
            for( let description of this.collectionDescriptions ){
                if( description['collectionName'] === temp['name'] ){
                    temp['description'] = description['description'];
                    temp['id'] = description['id'];
                    temp['licenseId'] = description['licenseId'];
                }
            }
            this.collectionsAndDescriptions.push( temp );
        }
        this.sendCollectionsAndDescriptions();
    }


    mergeCollectionSitesAndDescriptions() {
        // Go through the names

        for( let name of this.collectionSiteNames ){
            let temp = { 'name': name };
            temp['description'] = '';
            temp['id'] = -1;

            // See if we can find a description for the collection name
            for( let description of this.collectionDescriptions ){
                let regexp = new RegExp( '^' + description['collectionName'] + '//.*' );
                if( regexp.test( temp['name'] ) ){
                    // if( temp['name'].localeCompare( description['collectionName'] ) === 0 ){
                    temp['description'] = description['description'];
                    temp['id'] = description['id'];
                    temp['licenseId'] = description['licenseId'];
                }
            }
            this.collectionSitesAndDescriptions.push( temp );
        }

        this.sendCollectionSitesAndDescriptions();
    }

    // @TODO Explain
    async sendCollectionsAndDescriptions() {
        await this.utilService.sleep( Consts.waitTime );
        this.collectionsAndDescriptionEmitter.emit( this.collectionsAndDescriptions );
    }

    // @TODO Explain
    async sendCollectionSitesAndDescriptions() {
        await this.utilService.sleep( Consts.waitTime );

        this.collectionSitesAndDescriptionEmitter.emit( this.collectionSitesAndDescriptions );
    }

    getUserRoles() {
        return this.userRoles;
    }

    // get roles
    getRoles() {
        if( this.utilService.isNullOrUndefinedOrEmpty( this.accessTokenService.getAccessToken() ) ){
            this.userRoles = [Consts.ERROR, -1];
        }else{

            // Get this users role(s)
            this.doGet( Consts.GET_USER_ROLES ).subscribe(
                ( resGetUserRoles ) => {
                    this.userRoles = resGetUserRoles;
                    this.updatedUserRolesEmitter.emit( this.userRoles );
                },

                // Error
                async( errGetUserRoles ) => {
                    // If we can't get the users role(s) because of 401 "Unauthorized" set the first (only) element to Consts.ERROR_401, so we will know we need to Login.
                    // Token has expired, try to get a new one
                    if( errGetUserRoles['status'] === 401 ){

                        // If there is no user name and pass word, the refresh token will be used
                        this.accessTokenService.getAccessTokenFromServer( this.accessTokenService.getCurrentUser(), this.accessTokenService.getCurrentPassword() );

                        this.accessTokenService.setAccessTokenStatus( TokenStatus.NO_TOKEN_YET );
                        while( this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ){
                            await this.utilService.sleep( Consts.waitTime );
                        }
/*
                        if( this.accessTokenService.getAccessTokenStatus() === TokenStatus.GOOD_TOKEN ){
                            console.log( 'MHL 1002 Got a good token on the 2nd try: ', this.accessTokenService.getAccessTokenStatus() );

                        }else{
                            console.log( 'MHL 1002b ERROR BAD token 2nd try: ', this.accessTokenService.getAccessTokenStatus() );
                        }
*/

                        this.doGet( Consts.GET_USER_ROLES ).subscribe(
                            getUserRoles0 => {
                                this.userRoles = getUserRoles0;
                                this.updatedUserRolesEmitter.emit( this.userRoles );
                            },
                            getUserRolesError0 => {
                                this.updatedUserRolesErrorEmitter.emit( getUserRolesError0 );
                                this.loadingDisplayService.setLoading( false );
                                alert( 'Server error: ' + getUserRolesError0.statusText + ' (' + getUserRolesError0['status'] + ') - ' + getUserRolesError0.error['error'] );
                            } );

                    }else{
                        console.error( 'getRoles Server error: ', errGetUserRoles  + ' (' + errGetUserRoles['status'] + ') - ' + errGetUserRoles.error['error'] );
                    }
                } );
        }
    }


    downLoadDicomImageFile( seriesUID, objectUID, studyUID ) {
        this.getDicomImage( seriesUID, objectUID, studyUID ).subscribe(
            data => {
                let dicomFile = new Blob( [data], { type: 'application/dicom' } );
                let url = (<any>window).URL.createObjectURL( dicomFile );
                (<any>window).open( url );
            },
            err => {
                console.error( 'Error downloading DICOM: ', err );
                this.getDicomImageErrorEmitter.emit( err );
            }
        );
    }


    getDicomImage( seriesUID, objectUID, studyUID ): Observable<any> {
        let post_url = Properties.API_SERVER_URL + '/nbia-api/services/getWado';
        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer  ' + this.accessTokenService.getAccessToken()
        } );

        let data = 'seriesUID=' + seriesUID + '&objectUID=' + objectUID + '&studyUID=' + studyUID + '&requestType=WADO';

        if( Properties.DEBUG_CURL ){
            let curl = 'curl  -v -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
            console.log( '002doGet: ' + curl );
        }

        let options =
            {
                headers: headers,
                method: 'post',
                responseType: 'blob' as 'blob'
            };
        return this.httpClient.post( post_url, data, options );
    }


    downloadSeriesList( seriesList ) {
        let query = seriesList + '&includeAnnotation=true';
        let downloadManifestUrl = Properties.API_SERVER_URL + '/' + Consts.API_MANIFEST_URL;

        if( Properties.DEBUG_CURL ){
            let curl = ' curl -H \'Authorization:Bearer  ' + this.accessTokenService.getAccessToken() + '\' -k \'' + Properties.API_SERVER_URL +
                '/' + Consts.API_MANIFEST_URL + '\' -d \'' + query + '\'';
            console.log( 'doPost: ', curl );
        }


        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.accessTokenService.getAccessToken()
        } );

        let options = {
            headers: headers,
            responseType: 'text' as 'text'
        };

        return this.httpClient.post( downloadManifestUrl, query, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) );
    }


    /**
     * @TODO react to not having a accessToken.
     *
     * @param queryType
     */
    doGet( queryType, query ? ) {
        let getUrl = Properties.API_SERVER_URL + '/nbia-api/services/' + queryType;

        if( Properties.DEBUG_CURL ){
            let curl = 'curl -H \'Authorization:Bearer  ' + this.accessTokenService.getAccessToken() + '\' -k \'' + getUrl + '\'';
            console.log( '001 doGet: ' + curl );
        }

        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.accessTokenService.getAccessToken()
        } );

        let options = {
            headers: headers,
            method: 'get',
        };

        let results;
        try{
            results = this.httpClient.get( getUrl, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) );
            // console.log( 'MHL doGet [' + queryType + '] [' + query + ']: ', results );
        }catch( e ){
            // TODO react to error.
            console.error( 'doGet Exception: ' + e );
        }
        return results;
    }

    doGet0( queryType, query ? ) {
        let getUrl = Properties.API_SERVER_URL + '/nbia-api/services/' + queryType;

        if( Properties.DEBUG_CURL ){
            let curl = 'curl -H \'Authorization:Bearer  ' + this.accessTokenService.getAccessToken() + '\' -k \'' + getUrl + '\'';
            console.log( '001 doGet: ' + curl );
        }

        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.accessTokenService.getAccessToken()
        } );

        let options = {
            headers: headers,
            method: 'get',
        };
        let errorMsg = 'No Error';
        let results;
        results = this.httpClient.get( getUrl, options ).pipe(
            catchError( error => {
                if( error.error instanceof ErrorEvent ){
                    errorMsg = `Error: ${error.error.message}`;
                }else{
                    errorMsg = `Error: ${error.message}`;
                }
                return of( [] );
            } )
        );

        return results;
    }

    doPost( queryType, query ) {
        let simpleSearchUrl = Properties.API_SERVER_URL + '/nbia-api/services/' + queryType;
        if( Properties.DEBUG_CURL ){
            let curl = 'curl -H \'Authorization:Bearer  ' + this.accessTokenService.getAccessToken() + '\' -k \'' + Properties.API_SERVER_URL + '/nbia-api/services/' + queryType + '\' -d \'' + query + '\'';
            console.log( 'doPost: ', curl );
        }

        let headers = null;

        if( queryType === Consts.UPDATE_COLLECTION_DESCRIPTION ){
            headers = new HttpHeaders( {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + this.accessTokenService.getAccessToken()
            } );
        }else{
            headers = new HttpHeaders( {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + this.accessTokenService.getAccessToken()
            } );
        }
        let options;

        // These are returned as text not JSON (which is the default return format).
        if( queryType === Consts.UPDATE_COLLECTION_DESCRIPTION ||
            queryType === Consts.SUBMIT_SERIES_DELETION ||
            queryType === Consts.SUBMIT_ONLINE_DELETION ||
            queryType === Consts.SUBMIT_COLLECTION_LICENSES ||
            queryType === Consts.SUBMIT_DELETE_COLLECTION_LICENSES ||
            queryType === Consts.SUBMIT_QC_STATUS_UPDATE
        ){
            options = {
                headers: headers,
                responseType: 'text' as 'text'
            };
        }else{
            options = {
                headers: headers
            };
        }
        return this.httpClient.post( simpleSearchUrl, query, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) );
    }

    // CHECKME Should a license be optional?
    updateCollectionDescription( name, description, licenseId ) {
        this.doPost( Consts.UPDATE_COLLECTION_DESCRIPTION, 'name=' + name +
            '&description=' + encodeURIComponent( description ) +
            '&license=' + licenseId
        ).subscribe(
            data => {
                console.log( 'updateCollectionDescription response: ', data );
            },
            error => {
                console.error( 'ERROR updateCollectionDescription doPost: ', error );
            }
        )
    }


    /**
     * For rest calls with no access token.
     *
     * @param queryType
     */
    doGetNoToken( queryType ) {
        let getUrl = Properties.API_SERVER_URL + '/nbia-api/services/' + queryType;

        if( Properties.DEBUG_CURL ){
            let curl = 'curl  -k \'' + getUrl + '\'';
            console.log( '003 doGet: ' + curl );
        }

        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded'
        } );

        let options = {
            headers: headers,
            method: 'get',
            responseType: 'text' as 'text'
        };

        let results;
        try{
            results = this.httpClient.get( getUrl, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) );
        }catch( e ){
            // TODO react to error.
            console.error( 'doGetNoToken Exception: ' + e );
        }

        return results;
    }

}
