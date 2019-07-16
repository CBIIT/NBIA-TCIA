import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { UtilService } from '@app/common/services/util.service';
import { CookieOptionsArgs } from 'angular2-cookie/core';


@Injectable()
export class PersistenceService{

    public Field = Object.freeze( {
        // Numerical value of data display tab "Summaary", "Search Results", or "Test"
        DATA_DISPLAY_TAB: 'dataDisplayTab',

        SEARCH_RESULTS_ROWS_PER_PAGE: 'search_results_rows_PerPage',
        CARTS_PER_PAGE: 'carts_PerPage',

        // Simple Search = 0, Free Text = 1, Query Builder = 2
        QUERY_TYPE_TAB: 'queryTypeTab',

        IMAGE_MODALITY_ANY_ALL: 'imageModalityAnyAll',
        USER: 'userName',

        // Users choices of which search criteria are collapsed, and which are shown
        CRITERIA_QUERY_SHOW: 'criteriaQueryShow',

        // true sort by count
        COLLECTIONS_SORT_BY_COUNT: 'collectionsSortByCount',
        SEARCH_RESULTS_SORT_STATE: 'searchResultSortState',
        SEARCH_RESULTS_COLUMNS: 'searchResultsColumns',
        CART_SORT_STATE: 'cartSortState',
        SHOW_DOWNLOADER_DOWNLOAD: 'showDownloaderDownload',
        SHOW_INTRO: 'showIntro',

        LAST_ACCESS: 'lastAccess',

        ACCESS_TOKEN: 'at',
        IS_GUEST: 'guest'

    } );

    /**
     * The name to be used for the cookie.
     * @type {string}
     */
    DATA_NAME = 'NBIA_data';

    /**
     * The main data object.
     * @type {{}}
     */
    data = {};

    constructor( private cookieService: CookieService, private utilService: UtilService ) {
        // Get persisted data, if there is any.
        this.getData();

    }

    /**
     * Add or update the data object, then persist the updated data object.
     * @param key  The item to be added.
     * @param value  The contents of the added item.
     */
    put( key, value ) {
        // Only update if the value has ganged.
        if( this.get(key) !== value){
            this.data[key] = value;
        }
        this.update();
    }

    /**
     * Return the value from the data object, it is kept up to date by any put so there is no need to retrieve the persisted data.
     * @param key  The name of the item to be retrieved.
     * @returns {any}  The contents of the the item that has been retrieved.
     */
    get( key ) {
        return this.data[key];
    }

    /**
     * Deletes the "key" value from "data".
     * @param key  The item to remove.
     */
    remove( key ) {
        delete this.data[key];
        this.update();
    }


    /**
     * Writes the data to be persisted to a cookie.<br>
     * It is possible for to not be updated fast enough, causing old data can written to the cookie, so we delay a little.
     *
     * @returns {Promise<void>}
     */
     update() {
        let expiresTimestamp: Date = new Date();
        expiresTimestamp.setFullYear( 2035 );

        let testData = '{\n' +
            '   "guest":true,\n' +
            '   "lastAccess":{\n' +
            '      "date":{\n' +
            '         "day":12,\n' +
            '         "month":7,\n' +
            '         "year":2019\n' +
            '      }\n' +
            '   },\n' +
            '   "showIntro":false,\n' +
            '   "cartSortState":"[0,0,1,0,0,0,0,0,0,0]",\n' +
            '   "queryTypeTab":0,\n' +
            '   "criteriaQueryShow":"{\\"showQueryAvailable\\":false,\\"showQuerySubjectIds\\":false,\\"showQueryPhantoms\\":false,\\"showQueryThirdParty\\":false,\\"showQueryCollections\\":true,\\"showQueryImageModality\\":true,\\"showQueryAnatomicalSite\\":true,\\"showQuerySpecies\\":true}",\n' +
            '   "searchResultSortState":"[0,0,1,0,0,0,0,0,0,0,0]",\n' +
            '   "search_results_rows_PerPage":10,\n' +
            '   "carts_PerPage":10,\n' +
            '   "at":"9bb27702-8cda-41bb-9116-1aab7008e4b2",\n' +
            '   "dataDisplayTab":1,\n' +
            '   "searchResultsColumns":[\n' +
            '      {\n' +
            '         "name":"Cart",\n' +
            '         "selected":true,\n' +
            '         "required":true,\n' +
            '         "textSearch":true,\n' +
            '         "criteriaSearch":true,\n' +
            '         "seq":0\n' +
            '      },\n' +
            '      {\n' +
            '         "name":"Collection ID",\n' +
            '         "selected":true,\n' +
            '         "required":true,\n' +
            '         "textSearch":true,\n' +
            '         "criteriaSearch":true,\n' +
            '         "seq":1\n' +
            '      },\n' +
            '      {\n' +
            '         "name":"3rd Party",\n' +
            '         "selected":true,\n' +
            '         "required":false,\n' +
            '         "textSearch":false,\n' +
            '         "criteriaSearch":true,\n' +
            '         "seq":2\n' +
            '      },\n' +
            '      {\n' +
            '         "name":"Subject ID",\n' +
            '         "selected":true,\n' +
            '         "required":true,\n' +
            '         "textSearch":true,\n' +
            '         "criteriaSearch":true,\n' +
            '         "seq":3\n' +
            '      },\n' +
            '      {\n' +
            '         "name":"Hit",\n' +
            '         "selected":true,\n' +
            '         "required":false,\n' +
            '         "textSearch":true,\n' +
            '         "criteriaSearch":false,\n' +
            '         "seq":4\n' +
            '      },\n' +
            '      {\n' +
            '         "name":"Studies",\n' +
            '         "selected":true,\n' +
            '         "required":true,\n' +
            '         "textSearch":false,\n' +
            '         "criteriaSearch":true,\n' +
            '         "seq":5\n' +
            '      },\n' +
            '      {\n' +
            '         "name":"Total Studies",\n' +
            '         "selected":false,\n' +
            '         "required":false,\n' +
            '         "textSearch":true,\n' +
            '         "criteriaSearch":true,\n' +
            '         "seq":6\n' +
            '      },\n' +
            '      {\n' +
            '         "name":"Series",\n' +
            '         "selected":true,\n' +
            '         "required":false,\n' +
            '         "textSearch":false,\n' +
            '         "criteriaSearch":true,\n' +
            '         "seq":8\n' +
            '      },\n' +
            '      {\n' +
            '         "name":"Total Series",\n' +
            '         "selected":false,\n' +
            '         "required":false,\n' +
            '         "textSearch":true,\n' +
            '         "criteriaSearch":true,\n' +
            '         "seq":9\n' +
            '      },\n' +
            '      {\n' +
            '         "name":"Disk Space",\n' +
            '         "selected":false,\n' +
            '         "required":false,\n' +
            '         "textSearch":true,\n' +
            '         "criteriaSearch":true,\n' +
            '         "seq":10\n' +
            '      },\n' +
            '      {\n' +
            '         "name":"Image Count",\n' +
            '         "selected":false,\n' +
            '         "required":false,\n' +
            '         "textSearch":true,\n' +
            '         "criteriaSearch":true,\n' +
            '         "seq":11\n' +
            '      }\n' +
            '   ]\n' +
            '}';

        let options: CookieOptionsArgs = <CookieOptionsArgs> {
            expires: expiresTimestamp
        };
        this.cookieService.put( this.DATA_NAME, JSON.stringify( this.data ), options );
    }


    /**
     * Retrieve persisted date from the cookie, and store it in "this.data".
     */
    getData() {
        let cookieData = this.cookieService.get( this.DATA_NAME );
        if( !this.utilService.isNullOrUndefined( cookieData ) ){
            try{
                this.data = JSON.parse( cookieData );
            }
            catch( e ){
                console.error( 'Error parsing persisted data: ', e.message );
            }
        }
    }

    /**
     * Wait.
     *
     * @param ms  Number of milliseconds to wait.
     * @returns {Promise}
     */
    sleep( ms ) {
        return new Promise( resolve => setTimeout( resolve, ms ) );
    }
}
