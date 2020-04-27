import { EventEmitter, Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { ParameterService } from './parameter.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { Consts, TokenStatus } from '@app/constants';
import { Properties } from '@assets/properties';
import { AccessTokenService } from './access-token.service';

@Injectable( {
    providedIn: 'root'
} )
export class ApiService{
    userRoles;
    collectionSiteNames;
    collectionNames;
    collectionDescriptions;
    collectionSitesAndDescriptions = [];
    collectionsAndDescriptions = [];

    updatedUserRolesEmitter = new EventEmitter();
    collectionSitesAndDescriptionEmitter = new EventEmitter();
    collectionsAndDescriptionEmitter = new EventEmitter();

    // When a QC Tools or Approve Deletion search is run, it emits the Collection//Site to the search
    // results so we can Show the Collection in the resuls, but not get it back from the server with each row of results.
    collectionSiteEmitter = new EventEmitter();

    searchResultsEmitter = new EventEmitter();
    resultsErrorEmitter = new EventEmitter();

    qcHistoryResultsEmitter = new EventEmitter();
    qcHistoryErrorEmitter = new EventEmitter();

    qcHistoryResultsTableEmitter = new EventEmitter();
    qcHistoryTableErrorEmitter = new EventEmitter();

    visibilitiesEmitter = new EventEmitter();
    visibilitiesErrorEmitter = new EventEmitter();

    submitBulkQcResultsEmitter = new EventEmitter();
    submitBulkQcErrorEmitter = new EventEmitter();

    submitSeriesDeletionResultsEmitter = new EventEmitter();
    submitSeriesDeletionErrorEmitter = new EventEmitter();

    constructor( private utilService: UtilService, private parameterService: ParameterService,
                 private httpClient: HttpClient, private accessTokenService: AccessTokenService ) {

        this.init();

    }

    async init() {
        // Wait until we are sure we have the access token (if there is one).
        while( !this.parameterService.haveParameters() ){
            await this.utilService.sleep( Consts.waitTime );
        }
        this.update();
    }

    update() {
        this.getRoles();
    }

    // TODO rename this, we use it for queries too that are not from that left side Criteria search.
    doSubmit( tool, submitData ) {
        switch( tool ){
            case Consts.TOOL_BULK_QC:
                this.submitBulkQc( submitData );
                break;

            case Consts.GET_HISTORY_REPORT:
                this.getQcHistoryReport(submitData );
                break;

            case Consts.GET_HISTORY_REPORT_TABLE:
                this.getQcHistoryReportTable(submitData );
                break;

            case Consts.TOOL_APPROVE_DELETIONS:
                this.submitBulkDeletion(submitData );
                break;

        }
    }

// collectionSite=CBIS-DDSM//CBIS-DDSM&fromDate=01-01-2017&toDate=01-01-2019
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
                // Don't do the search, and send back empty results.
                this.searchResultsEmitter.emit( [Consts.NO_SEARCH] );

            }
        }

    }

    submitBulkQc( query ) {
        this.doPost( Consts.SUBMIT_QC_STATUS_UPDATE, query ).subscribe(
            ( data ) => {
                this.submitBulkQcResultsEmitter.emit(data);
            },
            ( err ) => {
                this.submitBulkQcErrorEmitter.emit(err);
                console.error( 'submitBulkQc err: ', err['error'] );
                console.error( 'submitBulkQc err: ', err );
            } );
    }

    submitBulkDeletion( query ) {
        this.doPost( Consts.SUBMIT_SERIES_DELETION, query ).subscribe(
            ( data ) => {
                this.submitSeriesDeletionResultsEmitter.emit(data);
            },
            ( err ) => {
                this.submitSeriesDeletionErrorEmitter.emit(err);
                console.error( 'submitBulkDeletion err: ', err['error'] );
                console.error( 'submitBulkDeletion err: ', err );
            } );
    }

    getQcHistoryReport(query){
        this.doPost( Consts.GET_HISTORY_REPORT, query ).subscribe(
            ( data ) => {
                this.qcHistoryResultsEmitter.emit(data);
            },
            ( err ) => {
                this.qcHistoryErrorEmitter.emit(err);
                console.error( 'getQcHistoryReport err: ', err['error'] );
                console.error( 'getQcHistoryReport err: ', err );
            } );

    }

    getQcHistoryReportTable(query){
        this.doPost( Consts.GET_HISTORY_REPORT, query ).subscribe(
            ( data ) => {
                this.qcHistoryResultsTableEmitter.emit(data);
            },
            ( err ) => {
                this.qcHistoryTableErrorEmitter.emit(err);
                console.error( 'getQcHistoryReportTable err: ', err['error'] );
                console.error( 'getQcHistoryReportTable err: ', err );
            } );

    }

    getVisibilities(){
        this.doGet( Consts.GET_VISIBILITIES ).subscribe(
            ( data ) => {
                this.visibilitiesEmitter.emit(data);
            },
            ( err ) => {
                this.visibilitiesErrorEmitter.emit(err);
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
                if( approveDeletionsSearchDataError['status'] === 401){
                    console.log('MHL Token has expired, try to get a new one');
                    this.accessTokenService.getAccessTokenFromServer( this.accessTokenService.getCurrentUser(), this.accessTokenService.getCurrentPassword() );
                    while( this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ){
                        await this.utilService.sleep( Consts.waitTime );
                    }
                    this.doPost( Consts.GET_SEARCH_FOR_APPROVE_DELETIONS, query ).subscribe(
                        approveDeletionsSearchData0  => {
                            this.searchResultsEmitter.emit( approveDeletionsSearchData0 );
                        },
                        performQcSearchDataError0 => {
                            this.resultsErrorEmitter.emit( performQcSearchDataError0 );
                        });
                }
                else{

                    this.resultsErrorEmitter.emit( approveDeletionsSearchDataError );
                    console.error( 'Could not get ApproveDeletionsSearch from server: ', approveDeletionsSearchDataError );
                }
            } );
    }

     getPerformQcSearch( query ) {
        this.collectionSiteEmitter.emit( query.replace( /^.*collectionSite=/, '' ).replace( /&.*$/, '' ) );
        this.doPost( Consts.GET_SEARCH_FOR_PERFORM_QC, query ).subscribe(
            ( performQcSearchData ) => {
                this.searchResultsEmitter.emit( performQcSearchData );
            },
            async performQcSearchDataError => {

                // Token has expired, try to get a new one
                if( performQcSearchDataError['status'] === 401){
                    console.log('MHL Token has expired, try to get a new one');
                    this.accessTokenService.getAccessTokenFromServer( this.accessTokenService.getCurrentUser(), this.accessTokenService.getCurrentPassword() );
                    while( this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ){
                        await this.utilService.sleep( Consts.waitTime );
                    }
                    this.doPost( Consts.GET_SEARCH_FOR_PERFORM_QC, query ).subscribe(
                         performQcSearchData0  => {
                            this.searchResultsEmitter.emit( performQcSearchData0 );
                        },
                        performQcSearchDataError0 => {
                            this.resultsErrorEmitter.emit( performQcSearchDataError0 );
                        });
                }


                else{
                    this.resultsErrorEmitter.emit( performQcSearchDataError );
                    console.error( 'Could not get performQcSearch from server: ', performQcSearchDataError['status'] );
                    console.error( 'Could not get performQcSearch from server: ', Array.from( new Uint8Array( performQcSearchDataError ) ) );
                }
            } );
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
                errGetUserRoles => {
                    // If we can't get the users role(s) because of 401 "Unauthorized" set the first (only) element to Consts.ERROR_401, so we will know we need to Login.
                    if( errGetUserRoles.status === 401 ){
                        // this.userRoles = [Consts.ERROR_401];
                    }else{
                        console.error( 'Could not get user\'s roles from server: ', errGetUserRoles );
                        // this.userRoles = [Consts.ERROR, errGetUserRoles.status];
                    }
                } );
        }
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
            console.log( 'doGet: ' + curl );
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
        }catch( e ){
            // TODO react to error.
            console.error( 'doGet Exception: ' + e );
        }

        return results;
    }

    doPost( queryType, query ) {

        if( Properties.DEBUG_CURL ){
            let curl = 'curl -H \'Authorization:Bearer  ' + this.accessTokenService.getAccessToken() + '\' -k \'' + Properties.API_SERVER_URL + '/nbia-api/services/' + queryType + '\' -d \'' + query + '\'';
            console.log( 'doPost: ', curl );
        }

        let simpleSearchUrl = Properties.API_SERVER_URL + '/nbia-api/services/' + queryType;


        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.accessTokenService.getAccessToken()
        } );

        let options;

        // These are returned as text NOT JSON.
        if( queryType === Consts.UPDATE_COLLECTION_DESCRIPTION ||
            queryType === Consts.SUBMIT_SERIES_DELETION ||
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

    updateCollectionDescription( name, description ) {
        this.doPost( Consts.UPDATE_COLLECTION_DESCRIPTION, 'name=' + name + '&description=' + description ).subscribe(
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
            console.log( 'doGet: ' + curl );
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
