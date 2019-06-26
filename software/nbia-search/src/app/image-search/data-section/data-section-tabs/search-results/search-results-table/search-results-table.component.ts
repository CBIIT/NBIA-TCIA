import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { CartService } from '@app/common/services/cart.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Consts } from '@app/consts';
import { SearchResultsSortService } from '../search-results-sort.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { UtilService } from '@app/common/services/util.service';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';
import { Properties } from '@assets/properties';
import { ParameterService } from '@app/common/services/parameter.service';
import { HistoryLogService } from '@app/common/services/history-log.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertBoxButtonType, AlertBoxType } from '@app/common/components/alert-box/alert-box-consts';
import { AlertBoxService } from '@app/common/components/alert-box/alert-box.service';

@Component( {
    selector: 'nbia-search-results-table',
    templateUrl: './search-results-table.component.html',
    styleUrls: ['./search-results-table.component.scss']
} )

/**
 * Receives query from commonService.updateQueryEmitter.
 * Runs the search - calls apiServerService.doSearch.
 * Displays results.
 */
export class SearchResultsTableComponent implements OnInit, OnDestroy{

    /**
     * Receives the data for the query from commonService.updateQueryEmitter.<br>
     * It receives a category's data, when the user changes it's criteria.
     * @type {Array}
     */
    queryData = [];

    /**
     * Accumulates all the query data. It is updated as new data is received by commonService.updateQueryEmitter (stored in queryData),<br>
     * one category at a time.
     * @type {Array}
     */
    allData = [];

    /**
     * The current search results. This can be populated from a search, or restored from saved results when user switches between different search types.
     * @type {Array}
     */
    searchResults = [];
    searchResultsForDisplay = [];


    /**
     * The saved result search results from a Simple search.<br>
     * Used to restore the search results after switching search types.
     */
    simpleSearchResults;


    /**
     * The saved result search results from a Text search.<br>
     * Used to restore the search results after switching search types.
     */
    textSearchResults;

    /**
     * If there was an error doing the search, it will be stored here via apiServerService.simpleSearchErrorEmitter.subscribe.
     */
    error;

    // CHECKME this (default) needs to match SearchResultsService.scrollFlag
    scroll = false;

    /**
     * This is the list of columns in the search results display. It is populated from persisted user preferances, or Consts.DEFAULT_SEARCH_RESULTS_COLUMNS<br>
     * if there are no persisted values. It can be updated at any time via commonService.searchResultsColumnListEmitter.subscribe, which is<br>
     * called by SearchResultsColumnSelectorComponent.
     */
    columns;

    // Rows to display, combine pager and perPage
    firstRow: number = 0;
    lastRow: number;
    rowsPerPage: number;
    currentPage: number = 0;

    /**
     * Used by busyCartCheck() to keep track of the number of series that have been added to the Cart.
     * @type {number}
     */
    cartCount = 0;

    /**
     * Used by busyCartCheck() to keep track of the previous number of series that have been added to the Cart.
     * This is compared to cartCount, to determine if the Cart count is still changing.
     * @type {number}
     */
    cartCountTrailer = -1;

    cartList = [];

    /** This is/will be used to put the UI into a "Wait I'm Busy" state.
     * @type {boolean}
     */
    busy = false;

    /**
     * For HTML visibility.
     * @type {string}
     */
    SIMPLE_SEARCH = Consts.SIMPLE_SEARCH;

    /**
     * For HTML visibility.
     * @type {string}
     */
    TEXT_SEARCH = Consts.TEXT_SEARCH;

    /**
     * For HTML visibility.
     */
    DISABLE_COUNTS_AND_SIZE = Properties.DISABLE_COUNTS_AND_SIZE;

    /**
     * This is used to tell the HTML when to display columns that are for "Simple search", or "Free text".
     */
    currentSearchMode;

    imageModalityAnyOrAllTrailer = '';
    totalCount;

    thisPageRowCount = -1;

    columnCount;
    subjectDataShow = [];
    arrowMouseOver = [];

    myIsNullOrUndefined = this.utilService.isNullOrUndefined;

    alertId01 = 'nbia-cart-max-warning-01';

    properties = Properties;
    urlQuery = '';

    // TODO see if we can get rid of unused columns.  Problem is dealing with older cookies.
    // Adding 'collection' to 0,3, and 5, to have a default for missing sort columns that might be in an old cookie.
    // sortColumns = ['', 'collection', 'subject', '', 'study', '', 'series'];
    sortColumns = ['collection', 'collection', 'subject', 'collection', 'study', 'collection', 'series'];

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private apiServerService: ApiServerService,
                 private cartService: CartService, private sortService: SearchResultsSortService,
                 private persistenceService: PersistenceService, private loadingDisplayService: LoadingDisplayService,
                 private parameterService: ParameterService, private historyLogService: HistoryLogService,
                 private utilService: UtilService, private alertBoxService: AlertBoxService ) {

        // currentSearchMode tells us if the "Simple search" or the "Free text" column names are shown.
        // We need the Consts.SEARCH_TYPES array, because persistenceService.Field.QUERY_TYPE_TAB is a number and currentSearchMode needs the string
        try{
            this.currentSearchMode = Consts.SEARCH_TYPES[this.persistenceService.get( this.persistenceService.Field.QUERY_TYPE_TAB )];
        }catch( e ){
        }
        // If there is no persisted value, use SEARCH_TYPE_DEFAULT.
        if( this.utilService.isNullOrUndefined( this.currentSearchMode ) ){
            this.currentSearchMode = Consts.SEARCH_TYPES[Consts.SEARCH_TYPE_DEFAULT];
        }

        // Called when the query changes, it sets queryData, and calls runSearch.
        // When a user changes a search criteria in the left side of the UI,
        // that category (referred to as "type" in this function) and any of its selected criteria are sent here (updateQueryEmitter.subscribe).
        // "allData" accumulates all the query criteria data for the search, broken out by types.
        this.commonService.updateQueryEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.queryData = (<any>data).slice();

                // Get the type. The first element of the queryData array is the criteria type (Collections, ImagModality, etc...)
                let type = this.queryData[0];

                // Remove the first element (which was the type) and just leave the data.
                this.queryData.splice( 0, 1 );

                // "allData" has all the query criteria data for the search, broken out by types
                // If the query has changed for this "type" run the search.
                if(
                    (this.utilService.isNullOrUndefined( this.allData[type] ))
                    ||
                    (this.imageModalityAnyOrAllTrailer !== this.apiServerService.getImageModalityAllOrAny()) // If only the AllOrAny
                    ||
                    (!this.arraysIdentical( this.allData[type], this.queryData )) // Compare the query sent here as "data" to the existing query
                ){
                    this.allData[type] = this.queryData;

                    // If this was called because a URL parameter was added, don't do the search.
                    // we will call this when we know all of the URL parameters have been set.
                    if( this.parameterService.getParameterStatus() ){
                        return;
                    }

                    // We need to NOT run this if a URL query being rerun because a user logged in.
                    if( (!this.parameterService.haveUrlSimpleSearchParameters()) || (this.commonService.getHaveUserInput()) ){  // TODO getHaveUserInput is not used as originally intended, look at refactoring.
                        this.runSearch();
                    }
                    this.imageModalityAnyOrAllTrailer = this.apiServerService.getImageModalityAllOrAny();
                }
                  // this.showAllQueryData();

            } );


    }

    async ngOnInit() {

        // Used in busyCartCheck to determine if the cart has finished updating, there is no easy way with things being updated asynchronous.
        this.cartService.cartCountEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {

                this.cartCount = data['count'];

                if( this.cartCount > Consts.CART_COUNT_MAX){
                    this.alertBoxService.alertBoxDisplay( this.alertId01,
                        AlertBoxType.ERROR,
                        'Exceeding max cart size ( ' + Consts.CART_COUNT_MAX + ' )',
                        ['Current cart count: ' + this.cartCount, 'Remove ' + (this.cartCount - Consts.CART_COUNT_MAX ) + ' to enable download.'],
                        AlertBoxButtonType.OKAY,
                        350
                    );
                }
            }
        );


        this.cartService.cartChangeEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.cartList = <any>data;
            }
        );


        // Updates the current search type, "Simple search", "Free text", etc.
        this.commonService.resultsDisplayModeEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.currentSearchMode = data;
            }
        );

        this.commonService.resetAllSimpleSearchForLoginEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.allData = [];
            }
        );


        // List of column names/headers
        this.commonService.searchResultsColumnListEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.columns = data;
                this.sortService.initSortState( this.columns );
            } );

        // The initial emit for the above searchResultsColumnListEmitter, may be sent, before we are initialized and listening,
        // so we will get the data here, once at start up, after that any changes will arrive from searchResultsColumnListEmitter.
        this.columns = this.persistenceService.get( this.persistenceService.Field.SEARCH_RESULTS_COLUMNS );
        // @TODO
        // This work around can be removed in the near future.  "Cart" is changing from not required to required,
        // this data is in the cookie, so we need to give users a little time for this change to get into their cookie.
        // 23_MAY_2018
        if( !this.utilService.isNullOrUndefined( this.columns ) && this.columns.length > 0 ){
            for( let column of this.columns ){
                if( column['name'] === 'Cart' ){
                    column['required'] = true;
                }
            }
        }

        if( this.utilService.isNullOrUndefined( this.columns ) || this.columns.length < 1 ){
            this.columns = Consts.DEFAULT_SEARCH_RESULTS_COLUMNS;
        }

        // Checks for persisted value, if none, sets default.
        this.sortService.initSortState( this.columns );

        // Update columnCount, it is the number of columns selected for display.
        // We need this to set colSpan for the Subject details in the results table (comming soon)
        this.steColumnCount();

        // Get number of rows to display  (per page)
        this.commonService.searchResultsPerPageEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.rowsPerPage = <number>data;
                this.lastRow = Number( this.firstRow ) + (+this.rowsPerPage - 1);
                this.updateThisPageRowCount();

            } );

        // Get current page number
        this.commonService.searchResultsPageEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.currentPage = <number>data;
                if( this.currentPage < 0 ){    // -1 means go to first bag, but if searching by page don't search again.
                    this.currentPage = 0;
                }

                this.firstRow = this.rowsPerPage * this.currentPage;
                this.lastRow = this.firstRow + (+this.rowsPerPage - 1);
                this.updateThisPageRowCount();

                if( this.properties.PAGED_SEARCH && <number>data > -1 ){
                    this.runSearch();
                }
            } );

        // Set table scroll style
        this.commonService.searchResultsToggleScrollEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.scroll = <boolean>data;
            } );

        // Called by the 'Clear' button on the left side of the Display query at the top.
        this.commonService.resetAllSimpleSearchEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.clearQuery();
            } );

        // Called when there are new Simple search results.
        this.apiServerService.simpleSearchResultsEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {

                this.subjectDataShow = [];

                if( (!this.utilService.isNullOrUndefined( data )) && ((<any>data).length > 0) ){
                    this.simpleSearchResults = data;

                    // Sort the new results
                    if( !this.properties.PAGED_SEARCH ){
                        this.commonService.updateSearchResultsCount( this.simpleSearchResults.length );
                        this.sortService.doSort( this.simpleSearchResults );
                    }

                    this.searchResults = this.simpleSearchResults;
                    this.commonService.setSimpleSearchResults( this.simpleSearchResults );
                    this.upDataSearchResultsForDisplay();
                }
                else{
                    this.commonService.setSimpleSearchResults( {} );
                    this.searchResults = [];
                    this.searchResultsForDisplay = [];

                    if( !this.utilService.isNullOrUndefined( this.apiServerService.getSimpleSearchQueryHold() ) ){
                        this.commonService.updateSearchResultsCount( 0 );
                    }

                }

                this.updateThisPageRowCount();

                this.loadingDisplayService.setLoading( false );
            }
        );

        // If there was an error rather than results from the search, the error message will arrive here.
        this.apiServerService.simpleSearchErrorEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.error = data;
                console.error( 'error: ', data );
                this.loadingDisplayService.setLoading( false );
            } );


        // Called when there are new Text search results.
        this.apiServerService.textSearchResultsEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.subjectDataShow = [];
                if( (!this.utilService.isNullOrUndefined( data )) && ((<any>data).length > 0) ){
                    this.textSearchResults = data;
                    this.commonService.updateSearchResultsCount( this.textSearchResults.length );

                    // Sort the new results
                    this.sortService.doSort( this.textSearchResults );

                    this.searchResults = this.textSearchResults;
                    // TODO Explain
                    this.commonService.setTextSearchResults( this.textSearchResults );
                    this.upDataSearchResultsForDisplay();

                }
                else{

                    this.commonService.setTextSearchResults( {} );
                    this.searchResults = [];
                    this.searchResultsForDisplay = [];
                }
                this.updateThisPageRowCount();
                this.loadingDisplayService.setLoading( false );

            } );

        // If there was an error rather than results from the search, the error message will arrive here.
        this.apiServerService.textSearchErrorEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            err => {
                console.error( 'SearchResultsTableComponent textSearchErrorEmitter.subscribe: ', err );
                this.loadingDisplayService.setLoading( false );
            } );


        /*
                // Called when the query changes, it sets queryData, and calls runSearch.
                // When a user changes a search criteria in the left side of the UI,
                // that category (referred to as "type" in this function) and any of its selected criteria are sent here (updateQueryEmitter.subscribe).
                // "allData" accumulates all the query criteria data for the search, broken out by types.
                this.commonService.updateQueryEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
                    data => {
                        this.queryData = (<any>data).slice();

                        // Get the type. The first element of the queryData array is the criteria type (Collections, ImagModality, etc...)
                        let type = this.queryData[0];

                        // Remove the first element (which was the type) and just leave the data.
                        this.queryData.splice( 0, 1 );

                        // "allData" has all the query criteria data for the search, broken out by types
                        // If the query has changed for this "type" run the search.
                        if(
                            (this.utilService.isNullOrUndefined( this.allData[type] ))
                            ||
                            (this.imageModalityAnyOrAllTrailer !== this.apiServerService.getImageModalityAllOrAny()) // If only the AllOrAny
                            ||
                            (!this.arraysIdentical( this.allData[type], this.queryData )) // Compare the query sent here as "data" to the existing query
                        ){
                            this.allData[type] = this.queryData;

                            // If this was called because a URL parameter was added, don't do the search.
                            // we will call this when we know all of the URL parameters have been set.
                            if( this.parameterService.getParameterStatus() ){
                                return;
                            }

                            // We need to NOT run this if a URL query being rerun because a user logged in.
                            if( (!this.parameterService.haveUrlSimpleSearchParameters()) || (this.commonService.getHaveUserInput()) ){  // TODO getHaveUserInput is not used as originally intended, look at refactoring.
                                this.runSearch();
                            }
                            this.imageModalityAnyOrAllTrailer = this.apiServerService.getImageModalityAllOrAny();
                        }
                        // this.showAllQueryData();

                    } );

        */


        this.commonService.rerunQueryEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            () => {
                this.runSearch();
            }
        );


        this.commonService.runSearchForUrlParametersEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            () => {
                // FIXME Rename this, have same name in commonService.
                this.runSearchForUrlParameters();
            }
        );


        // Get the total number of rows
        this.commonService.searchResultsCountEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.totalCount = data;
            }
        );

        this.commonService.closeSubjectDetailsEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.subjectDataShow[<number>data] = false;
            } );


    } // End of ngOnInit

    // TODO give this a better name
    runSearchForUrlParameters() {
        this.apiServerService.log( this.historyLogService.doLog( Consts.LOAD_SAVED_QUERY_LOG_TEXT, this.apiServerService.getCurrentUser(), this.apiServerService.buildSimpleSearchQuery( this.allData ) ) );
        this.runSearch();
    }


    updateThisPageRowCount() {
        let simpleSearchType = 0; // TODO this needs to be reworked with constants and a better way of doing "Consts.SEARCH_TYPES"
        let textSearchType = 1; // TODO this needs to be reworked with constants and a better way of doing "Consts.SEARCH_TYPES"
        if(
            (this.currentSearchMode === Consts.SEARCH_TYPES[simpleSearchType]) &&
            (this.utilService.isNullOrUndefined( this.simpleSearchResults ) || (this.simpleSearchResults.length < 1))
        ){
            this.thisPageRowCount = -1; // -1 = no results, the HTML uses this to disable the top cart button.
            return;
        }

        if(
            (this.currentSearchMode === Consts.SEARCH_TYPES[textSearchType]) &&
            (this.utilService.isNullOrUndefined( this.textSearchResults ) || (this.textSearchResults.length < 1))
        ){
            this.thisPageRowCount = -1; // -1 = no results, the HTML uses this to disable the top cart button.
            return;
        }

        // This is an off set, so plus 1 is the real count,  plus one is only used in the display HTML.
        if( !Properties.PAGED_SEARCH ){
            this.thisPageRowCount = this.lastRow > (this.searchResults.length - 1) ?
                this.searchResults.length -
                (parseInt( (<any>((this.searchResults.length - 1) / this.rowsPerPage)), 10 ) * this.rowsPerPage) - 1 :
                this.rowsPerPage - 1;
        }
        else{
            this.thisPageRowCount = this.searchResults.length;
        }

    }

    // FIXME  Add manufacturer when we have it
    // FIXME  This isn't working right ( returns false ) so it is not being used for now
    hasCriteriaOtherThanDate( type, nextQuery ) {
        let tempAllData = this.allData.slice();
        tempAllData[type] = nextQuery;
        let criteriaStr = ['CollectionCriteria', 'ImageModalityCriteria', 'AnatomicalSiteCriteria', 'PatientCriteria'];

        for( let name of criteriaStr ){
            if( (!this.utilService.isNullOrUndefined( tempAllData[name] )) && (tempAllData[name].length > 0) ){
                return true;
            }
        }
        return false;
    }


    /**
     * Compares two 1 dimensional arrays.
     *
     * @param a
     * @param b
     * @returns {boolean} True if the same False if not.
     */
    arraysIdentical( a, b ) {
        let i = a.length;
        if( i !== b.length ){
            return false;
        }
        while( i-- ){
            if( a[i] !== b[i] ){
                return false;
            }
        }
        return true;
    };

    /**
     * Called when a select ID in the Search results is clicked.
     * This will trigger a Drill down search, and populate the subjectDetails component.
     *
     * @param rowData
     */
    async onSubjectIdClick( i ) {

        if( this.utilService.isNullOrUndefined( this.subjectDataShow[i + 1] ) ){
            this.subjectDataShow[i + 1] = true;
        }else{
            this.subjectDataShow[i + 1] = !this.subjectDataShow[i + 1];
        }
    }

    /**
     * Resorts the results. Changes column, or if clicking on the current sort column reverses the sort.
     * If i===0 it is the Cart. We can no longer sort on the cart with results being retrieved one page at a time.
     *
     * @ FIXME this needs a better name.
     * @param i  The column clicked on.
     */
    onHeadingClick( i ) {
        // If i===0 it is the Cart. We can no longer sort on the cart with results being retrieved one page at a time.
        if( i === 0){
            return;
        }
        this.loadingDisplayService.setLoading( true, 'Sorting...' );
        this.sortService.updateSearchResultsSortState( i );
        this.sortService.doSort( this.searchResults );
        this.upDataSearchResultsForDisplay();

        // Paged search will be set to false if this is a Text search.
        if( this.properties.PAGED_SEARCH ){
            this.runSearch();
        }
        else{
            this.sortService.doSort( this.searchResults );
            this.upDataSearchResultsForDisplay();
        }

        this.loadingDisplayService.setLoading( false );
    }


    /**
     * Clear all search results and search results count.
     */
    clearQuery() {
        this.allData = [];
        this.clearSearchResults();
    }


    clearSearchResults() {
        this.searchResults = [];
        this.searchResultsForDisplay = [];

        this.allData = [];
        this.thisPageRowCount = -1; // Disables the top cart button.

        // For now this will just clear the copy used when rerunning Minimum matched studies.
        this.apiServerService.clearSearchResults();

        // The -1 tells the Results count, not to display zero, as if there had been a search with no results.
        this.commonService.updateSearchResultsCount( -1 );

    }


    /**
     * calls apiServerService.doSearch, which will run an asynchronous search call to the API server.
     * When the search is complete, this.searchResults is updated via apiServerService.simpleSearchResultsEmitter.subscribe.
     * If there was an error, this.error will be updated via apiServerService.simpleSearchErrorEmitter.subscribe.
     *
     * @todo we don't react enough to errors.
     */
    runSearch() {
        let query = this.apiServerService.buildSimpleSearchQuery( this.allData );

        // If the query is empty
        if( query.length < 1 ){
            this.clearSearch();
        }
        // Run the search
        else{

            if( this.properties.PAGED_SEARCH ){
                this.rowsPerPage = this.commonService.getResultsPerPage();
                query += '&sortField=' + this.sortColumns[this.sortService.getCurrentSortField()];
                let order = this.sortService.getSortState( this.sortService.getCurrentSortField() ) === 2 ? 'descending' : 'ascending'
                query += '&sortDirection=' + order;
                query += '&start=' + this.currentPage * this.rowsPerPage;
                query += '&size=' + this.rowsPerPage;
            }
            this.apiServerService.doSearch( Consts.SIMPLE_SEARCH, query );
            this.loadingDisplayService.setLoading( true, 'Searching...' );
        }
        // this.showAllQueryData();

        // Tells the Query display at the top of the Search results section, that this is the current/changed query.
        this.commonService.emitSimpleSearchQueryForDisplay( this.allData );
    }

    clearSearch() {
        this.searchResults = [];
        this.searchResultsForDisplay = [];
        this.commonService.updateSearchResultsCount( -1 );

        // Clear the query display
        this.commonService.emitSimpleSearchQueryForDisplay( [] );

        // Disables the top cart button.
        this.thisPageRowCount = -1;

        // Clear the current search results still held by the api service
        this.apiServerService.clearSearchResults();

    }


    getSelectedByIndex( i ): boolean {
        if( this.columns === undefined ){
            return true;
        }
        return this.columns[i].selected;
    }


    /**
     * When the Cart button/Dropdown to the right of the word 'Cart' in the table header is clicked.
     *
     * @param i  1 = All  0 = Just these
     */
    // CHECKME  -  i is going to be wrong when we add the Subject details to the table? Check the carts
    // FIXME rename this
    onCartCheckClick( i ) {

        // Don't do anything if we are still busy
        if( this.busy || (i === -1) ){
            return;
        }

        this.busy = true;
        this.loadingDisplayService.setLoading( true, 'Processing Cart data...' );


        // Just what is visible
        if( i === 0 ){
            let rows = [];
            this.updateThisPageRowCount();

            if( Properties.PAGED_SEARCH ){
                for( let f = 0; f < this.searchResults.length; f++ ){
                    rows.push( this.searchResults[f].subjectId );
                }
            }
            else{
                for( let f = 0; f <= this.thisPageRowCount; f++ ){
                    rows.push( this.searchResults[f + this.firstRow].subjectId );
                }
            }

            // Return 0 none in cart,  1 some in cart,  2 all in cart
            let inCart = this.getSubjectListCartState( rows );
            this.commonService.toggleCartSubset( rows, (inCart !== 2) );
        }

        // Toggle all
        if( i === 1 ){
            this.commonService.toggleCartCheck();
            // getCartCheck  true = Checked  false Unchecked
        }
        this.busyCartCheck( this.commonService.getCartCheck() );
    }


    /**
     *
     * @param rows
     * @returns {number}
     */
    getSubjectListCartState( rows ) {
        let inCartCount = 0;

        for( let row of rows ){
            for( let cart of this.cartList ){
                if( row === cart.subjectId ){
                    inCartCount++;
                }
            }
        }

        if( inCartCount === 0 ){
            return 0;
        }
        if( inCartCount >= rows.length ){
            return 2;
        }
        return 1;
    }


    /**
     * Used by busyCartCheck
     */
    clearBusy = () => {
        this.busy = false;
        this.cartCountTrailer = -1;
        this.loadingDisplayService.setLoading( false );

    };


    /**
     * TODO Replace this with use of LoadingDisplayComponent
     * Sets "busy" to true while data is being added or removed from the cart.<br>
     *
     * <ul>
     *   <li>Sets busy to true</li>
     *   <li>Saves current cartCount in cartCountTrailer</li>
     *   <li>Waits 500 milliseconds</li>
     *   <li>If cartCount is now different from cartCountTrailer, do it again.</li>
     *   <li>If cartCount equals cartCountTrailer, set busy to false and exit.</li>
     * </ul>
     *
     * @param {boolean} adding  True = all rows are to be added to the Cart.<br> False = all rows are being removed from the Cart.
     */
    busyCartCheck( adding: boolean ) {

        // Wait 500 milliseconds then execute the code within the { }
        setTimeout( () => {

                /*
                // True if cartCount is done increasing or emptying. cartCountTrailer is cartCount's previous value.
                if(
                    // The cart is done increasing.
                ((this.cartCountTrailer === this.cartCount) && adding && (this.cartCount > 0))
                ||

                // The Cart is empty.
                ((!adding) && (this.cartCount === 0))
                ){
                    this.clearBusy();
                    return;
                }
                */

                // @CHECKME this is worthy of additional attention.
                if( this.cartCountTrailer === this.cartCount ){
                    this.clearBusy();
                    return;
                }

                this.cartCountTrailer = this.cartCount;
                // this.loadingDisplayService.updateSubMessage( this.cartCount );
                this.busy = true;
                this.busyCartCheck( adding );
            },
            500 ); // CHECKME  make sure this is not too short - test on a low end machine.
    }

    // FIXME spelling
    steColumnCount() {
        this.columnCount = 0;
        for( let col of this.columns ){
            if(
                ((col.textSearch && (this.currentSearchMode === this.TEXT_SEARCH)) ||
                    (col.criteriaSearch && (this.currentSearchMode === this.SIMPLE_SEARCH))) &&
                (col.selected)
            ){
                this.columnCount++;
            }
        }
        if( Properties.SHOW_OHIF_VIEWER ){
            this.columnCount++;
        }
    }

    /**
     * Adds an empty row after each row of data.  The empty row will let us insert a subject-study-details in the ngFor loop
     */
    upDataSearchResultsForDisplay() {
        this.arrowMouseOver = new Array<number>( this.searchResults.length );
        this.searchResultsForDisplay = [];
        let i = 0;
        for( let row of this.searchResults ){
            this.searchResultsForDisplay.push( row );
            this.searchResultsForDisplay.push( {} );
            this.arrowMouseOver[i] = false;
            i++;
        }
    }


    // Just for testing
    showAllQueryData() {
        console.log( '-------------------------------------------------------------------');
        console.log( '-------------------------------------------------------------------');
        let criteriaStr = ['CollectionCriteria', 'ImageModalityCriteria',
            'AnatomicalSiteCriteria', 'PatientCriteria', 'ManufacturerCriteria', 'MinNumberOfStudiesCriteria', 'PhantomCriteria', 'ThirdPartyAnalysis'];
        for( let name of criteriaStr ){
            if( (!this.utilService.isNullOrUndefined( this.allData[name] )) && (this.allData[name].length > 0) ){
                console.log( 'allQueryData[' + name + ']: ', this.allData[name] );
            }
            else{
                console.log( 'allQueryData[' + name + ']: -' );
            }
        }
    }

    onArrowMouseOver( i ) {
        this.arrowMouseOver[i] = true;
    }

    onArrowMouseOut( i ) {
        this.arrowMouseOver[i] = false;
    }

    onSubjectOhifViewerClick(){
        alert( 'This feature (onSubjectOhifViewerClick) has not yet been implemented.' );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
