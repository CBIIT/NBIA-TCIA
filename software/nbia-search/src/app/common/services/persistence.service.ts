import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { UtilService } from '@app/common/services/util.service';
import { CookieOptionsArgs } from 'angular2-cookie/core';


@Injectable()
export class PersistenceService{

    public Field = Object.freeze( {
        // Numerical value of data display tab "Summary", "Search Results", or "Test"
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
        ANATOMICAL_SITE_SORT_BY_COUNT: 'anatomicalSiteSortByCount',
        SEARCH_RESULTS_SORT_STATE: 'searchResultSortState',
        SEARCH_RESULTS_COLUMNS: 'searchResultsColumns',
        CART_SORT_STATE: 'cartSortState',
        SHOW_DOWNLOADER_DOWNLOAD: 'showDownloaderDownload',
        SHOW_INTRO: 'showIntro',
        NO_COMMERCIAL_RESTRICTION_WARNING: 'noCommercialRestrictionWarning',

        LAST_ACCESS: 'lastAccess',

        ACCESS_TOKEN: 'at',
        ACCESS_TOKEN_LIFE_SPAN: 'atlp',
        REFRESH_TOKEN: 'rt',
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
        if( this.get( key ) !== value ){
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
     * Writes the data to be persisted to a cookie.
     *
     * @returns {Promise<void>}
     */
    update() {
        let expiresTimestamp: Date = new Date();
        expiresTimestamp.setFullYear( 2035 );

        let options: CookieOptionsArgs = <CookieOptionsArgs>{
            expires: expiresTimestamp
            // FIXME This prevents browser warning, but the cookie doesn't update  ,secure: true
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
            }catch( e ){
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
