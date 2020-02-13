import { EventEmitter, Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { ParameterService } from './parameter.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { Consts } from '../../constants';
import { Properties } from '../../../assets/properties';
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
    collectionsEmitter = new EventEmitter();
    ApproveDeletionsSearchResultsEmitter = new EventEmitter();
    ApproveDeletionsSearchErrorEmitter = new EventEmitter();

    getDicomTagsByImageEmitter = new EventEmitter();
    getDicomTagsByImageErrorEmitter = new EventEmitter();


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

// collectionSite=CBIS-DDSM//CBIS-DDSM&fromDate=01-01-2017&toDate=01-01-2019
    approveDeletionsQuery( queryData ) {
        let approveDeletionsQuery = '';

        // Build the correctly formatted query for the rest call here.
        for( let element of queryData ){

            switch( element['criteria'] ){
                case Consts.QUERY_CRITERIA_COLLECTION:
                    approveDeletionsQuery += '&collectionSite=' + element['data'];
                    break;

                case Consts.QUERY_CRITERIA_MOST_RECENT_SUBMISSION:
                    let dates = element['data'].split( ',' );
                    approveDeletionsQuery += '&fromDate=' + dates[0];
                    approveDeletionsQuery += '&toDate=' + dates[1];
                    break;

                case Consts.QUERY_CRITERIA_BATCH_NUMBER:
                    approveDeletionsQuery += '&batch=' + element['data'];
                    break;

                case Consts.QUERY_CRITERIA_RELEASED:
                    if( element['data'] === 1 ){
                        approveDeletionsQuery += '&released=No';
                    }else{
                        approveDeletionsQuery += '&released=Yes';
                    }
                    break;

                case Consts.QUERY_CRITERIA_CONFIRMED_COMPLETE:
                    if( element['data'] === 1 ){
                        approveDeletionsQuery += '&confirmedComplete=No';
                    }else{
                        approveDeletionsQuery += '&confirmedComplete=Complete';
                    }
                    break;

                case Consts.QUERY_CRITERIA_SUBJECT_ID:
                    for( let id of element['data'] ){
                        console.log( 'MHL QUERY_CRITERIA_SUBJECT_ID: ', id );
                        approveDeletionsQuery += '&subjectIds=' + id;
                    }
                    break;

            }
        }

        console.log( 'MHL Query: ', approveDeletionsQuery );

        // Do the search.
        this.getApproveDeletionsSearch( approveDeletionsQuery.substr( 1 ) );

    }

    getApproveDeletionsSearch( query ) {
        this.doPost( Consts.GET_SEARCH_FOR_APPROVE_DELETIONS, query ).subscribe(
            ( approveDeletionsSearchData ) => {
                console.log( 'MHL approveDeletionsSearchData query: ', query );
                console.log( 'MHL approveDeletionsSearchData: ', approveDeletionsSearchData );
                this.ApproveDeletionsSearchResultsEmitter.emit( approveDeletionsSearchData );
            },
            approveDeletionsSearchDataError => {
                this.ApproveDeletionsSearchErrorEmitter.emit( Array.from( new Uint8Array( approveDeletionsSearchDataError ) ) );
                console.error( 'Could not get ApproveDeletionsSearch from server: ', approveDeletionsSearchDataError );
            } );
    }


    getCollectionAndDescriptions() {
        this.doGet( Consts.GET_COLLECTION_DESCRIPTIONS ).subscribe(
            ( collectionDescriptionsData ) => {
                this.collectionDescriptions = collectionDescriptionsData;
                this.getCollectionNames();
                // this.getCollectionSitesAndDescription();
            },
            collectionAndDescriptionsError => {
                console.log( 'MHL AAA ERROR getCollectionDescriptions: ', this.userRoles );
                if( collectionAndDescriptionsError.status === 401 ){
                    this.userRoles = [Consts.ERROR_401];
                }else{
                    console.error( 'Could not get CollectionDescriptions from server: ', collectionAndDescriptionsError );
                    this.userRoles = [Consts.ERROR, collectionAndDescriptionsError.status];
                }
                console.log( 'MHL BBB ERROR getCollectionDescriptions: ', this.userRoles );

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
                console.log( 'MHL AAA ERROR getCollectionDescriptions: ', this.userRoles );
                if( collectionDescriptionsError.status === 401 ){
                    this.userRoles = [Consts.ERROR_401];
                }else{
                    console.error( 'Could not get CollectionDescriptions from server: ', collectionDescriptionsError );
                    this.userRoles = [Consts.ERROR, collectionDescriptionsError.status];
                }
                console.log( 'MHL BBB ERROR getCollectionDescriptions: ', this.userRoles );

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
                    console.log( 'MHL getCollectionNames DATA: ', collectionNamesData );
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
        console.log( 'MHL getUserRoles: ', this.userRoles );
        return this.userRoles;
    }

    // get roles
    getRoles() {
        if( this.utilService.isNullOrUndefinedOrEmpty( this.accessTokenService.getAccessToken() ) ){
            this.userRoles = [Consts.ERROR, -1];
        }else{
            console.log( 'MHL 010 getRoles token: ', this.accessTokenService.getAccessToken() );
            // Get this users role(s)
            this.doGet( Consts.GET_USER_ROLES ).subscribe(
                ( resGetUserRoles ) => {
                    console.log( 'MHL 011 getRoles: ', resGetUserRoles );
                    this.userRoles = resGetUserRoles;
                    this.updatedUserRolesEmitter.emit( this.userRoles );
                },
                errGetUserRoles => {
                    console.error( 'MHL 012 ERROR getRoles: ', errGetUserRoles );
                    // If we can't get the users role(s) because of 401 "Unauthorized" set the first (only) element to Consts.ERROR_401, so we will know we need to Login.
                    if( errGetUserRoles.status === 401 ){
                        // this.userRoles = [Consts.ERROR_401];
                    }else{
                        console.error( 'MHL 013 ERROR getRoles: ', errGetUserRoles );
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
        if( queryType === Consts.UPDATE_COLLECTION_DESCRIPTION ){
            options = {
                headers: headers,
                responseType: 'text' as 'text'
            };
        }else{
            options = {
                headers: headers
            };
        }

        /*
                console.log( 'doPost simpleSearchUrl: ', simpleSearchUrl );
                console.log( 'doPost query: ', query );
                console.log( 'doPost options: ', options );
        */

        return this.httpClient.post( simpleSearchUrl, query, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) );
    }

    updateCollectionDescription( name, description ) {
        this.doPost( Consts.UPDATE_COLLECTION_DESCRIPTION, 'name=' + name + '&description=' + description ).subscribe(
            data => {
                console.log( 'MHL updateCollectionDescription response: ', data );
            },
            error => {
                console.error( 'ERROR updateCollectionDescription doPost: ', error );
            }
        )
    }
}
