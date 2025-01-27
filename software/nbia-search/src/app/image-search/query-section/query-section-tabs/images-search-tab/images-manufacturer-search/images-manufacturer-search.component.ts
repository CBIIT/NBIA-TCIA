import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Consts } from '@app/consts';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { SearchResultsSortService } from '@app/image-search/data-section/data-section-tabs/search-results/search-results-sort.service';
import { Properties } from '@assets/properties';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilService } from '@app/common/services/util.service';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { QueryCriteriaInitService } from '@app/common/services/query-criteria-init.service';
import { isNullOrUndefined } from 'util';


/**
 * The list of selectable criteria that make up the Manufacturer LIST of the search query.
 */
@Component( {
    selector: 'nbia-images-manufacturer-search',
    templateUrl: './images-manufacturer-search.component.html',
    styleUrls: ['../../../../../app.component.scss', '../images-search-tab.component.scss', './images-manufacturer-search.component.scss']
} )

export class ImagesManufacturerSearchComponent implements OnInit, OnDestroy{

    /**
     * The list used by the HTML.
     */
    manufacturerList;

    /**
     * Used by the UI search within this criteria list (with the red magnifying glass), NOT the data search.
     */
    manufacturerListHold;
    resetFlag = true;

    /**
     * For hide or show this group of criteria when the arrows next to the heading are clicked.
     */
    showManufacturerValues;

    /**
     * For the 'X More' and 'Less...' in the list of criteria.
     *
     * @type {boolean}
     */
    showAll = false;

    /**
     * Used in the HTML when calculating how many criteria to display.  Checked criteria are always shown.
     */
    unCheckedCount;

    /**
     * Used in the HTML when calculating how many criteria to display.  Checked criteria are always shown.
     */
    checkedCount;

    /**
     * Tracks which criteria have been selected, used in the code, and the HTML.
     *
     * @type {Array}
     */
    cBox = [];

    /**
     * Used by the UI search within this criteria list (with the red magnifying glass), NOT the data search.
     *
     * @type {boolean}
     */
    searchHasFocus = false;
    searchXHasFocus = false;
    searchTextHasFocus = false;
    searchInput = '';

    searchToolTip = 'Search';
    showSearch = false;

    /**
     * The full original Criteria list from the server.
     * Ex.:
     * [
     *     {
     *         "Manufacturer":"Carestream",
     *        // "count":"20"
     *     },
     *     {
     *         "Manufacturer":"BREAST-DIAGNOSIS",
     *        // "count":"88"
     *     },...
     * ]
     */
    completeManufacturerValues;
    completeManufacturerValuesHold = null;

    /**
     * If a query passed in the URL has criteria that don't exist in our current list, they are put in the array, used to alert the user.
     *
     * @type {any[]}
     */
    missingCriteria = [];

    /**
     * To make visible to the HTML.
     *
     * @type {number}
     */
    properties = Properties;

    /**
     * For sorting of Collections.
     * We will over write this if there is a saved value in the browser cookie.
     *
     * @type {boolean}
     */
    sortNumChecked = Properties.SORT_COLLECTIONS_BY_COUNT;
    sortAlphaChecked = !this.sortNumChecked;


    /**
     * Used to clean up subscribes on the way out to prevent memory leak.
     * @type {Subject<boolean>}
     */
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private apiServerService: ApiServerService,
                 private sortService: SearchResultsSortService, private parameterService: ParameterService,
                 private initMonitorService: InitMonitorService, private queryUrlService: QueryUrlService,
                 private utilService: UtilService, private loadingDisplayService: LoadingDisplayService,
                 private persistenceService: PersistenceService, private queryCriteriaInitService: QueryCriteriaInitService ) {
    }

    async ngOnInit() {

        /**
         * Set to true when a sbuscribe returns an error.
         * It is used where we are waiting on subscribed data, to tell us to stop waiting, there will be no data.
         *
         * @type {boolean}
         */
        let errorFlag = false;

        // Update the Manufacturer sort criteria from a persisted value (Alpha or NUm).
        this.sortNumChecked = this.persistenceService.get( this.persistenceService.Field.MANUFACTURER_VALUES_SORT_BY_COUNT );
        // If there is no persisted value, use the same one as the others (Sort by count).
        // if( this.utilService.isNullOrUndefined( this.sortNumChecked ) ){
        //     this.sortNumChecked = Properties.SORT_MANUFACTURER_LIST_BY_COUNT;
        // }
        // this.sortAlphaChecked = !this.sortNumChecked;

        // ------------------------------------------------------------------------------------------
        // Get the full complete criteria list.
        // ------------------------------------------------------------------------------------------
        this.apiServerService.getManufacturerValuesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.queryCriteriaInitService.endQueryCriteriaInit();
                this.completeManufacturerValues = data;

                // If completeManufacturerValuesHold is null, this is the initial call.
                // completeManufacturerValuesHold lets us reset completeManufacturerValues when ever needed.
                if( this.completeManufacturerValuesHold === null ){
                    this.completeManufacturerValuesHold = this.utilService.copyManufacturerObjectArray( this.completeManufacturerValues );
                }

                // There is no query (anymore) reset the list of criteria to the initial original values.
                else if( this.apiServerService.getSimpleSearchQueryHold() === null ){
                    this.completeManufacturerValues = this.utilService.copyManufacturerObjectArray( this.completeManufacturerValuesHold );
                }

            }
        );

        // React to errors when getting the full complete criteria list.
        this.apiServerService.getManufacturerValuesErrorEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( err ) => {
                errorFlag = true;
                // TODO these errors need to be vetted, some are harmless, and shouldn't interrupt the UI flow
                // alert('error: ' + err);
                this.queryCriteriaInitService.endQueryCriteriaInit();
            }
        );

        // This call is to trigger populating this.completeManufacturerValues (above) and wait for the results.
        // Note that this is not in the .subscribe and will run when ngOnInit is called.
        this.loadingDisplayService.setLoading( true, 'Loading query data. This could take up to a minute.' );

        // This is used when there is a URL parameter query to determine if the component initialization is complete, and it is okay to run the query.
        this.queryCriteriaInitService.startQueryCriteriaInit();
        this.apiServerService.dataGet( 'v1/getManufacturerValues', '' );
        while( (this.utilService.isNullOrUndefined( this.completeManufacturerValues )) && (!errorFlag) ){
            await this.commonService.sleep( Consts.waitTime );
        }
        this.loadingDisplayService.setLoading( false, 'Done Loading query data' );

        // Reload the list of search criteria because a user has logged in,
        // they may have different access to available search criteria.
        this.commonService.resetAllSimpleSearchForLoginEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async() => {
                // This is used when a query included in the URL is to be rerun when a user logs in,
                // so the query knows not to rerun until all the search criteria are set. @see LoginComponent.

                this.initMonitorService.setManufacturerRunning( true );

                // The complete reset we need.
                this.resetFlag = true;
                this.completeManufacturerValues = null;

                // Get the list of all Manufacturer Sites in the database and the number of records which contain each Manufacturer Site.
                this.apiServerService.dataGet( 'v1/getManufacturerValues', '' );
                while( (this.utilService.isNullOrUndefined( this.completeManufacturerValues )) && (!errorFlag) ){
                    await this.commonService.sleep( Consts.waitTime );
                }
                this.completeManufacturerValuesHold = this.utilService.copyManufacturerObjectArray( this.completeManufacturerValues );

                // Was there a search passed in with the URL
                if( this.parameterService.haveUrlSimpleSearchParameters() ){
                    this.setInitialManufacturerValues();
                    this.updateCheckboxCount();
                }else{
                    this.resetAll();
                }
                this.initMonitorService.setManufacturerRunning( false );
            }
        );


        // Called when the "Clear" button on the left side of the Display query at the top.
        this.commonService.resetAllSimpleSearchEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
               this.queryUrlService.clear(this.queryUrlService.MANUFACTURER);
                this.completeManufacturerValues = this.utilService.copyManufacturerObjectArray( this.completeManufacturerValuesHold );
               // this.initMonitorService.setManufacturerInit(true);
            }
        );


        // Called when a query included in the URL contained one or more Manufacturer sites.
        this.parameterService.parameterManufacturerEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                // Deal with trailing (wrong) comma
                data = (<any>data).replace( /,$/, '' );

                // Data can be multiple values, comma separated
                let manufacturerListQueryList = (<any>data).split( /\s*,\s*/ );

                // If we don't have one or more of the Manufacturer sites that where included in the query, add them to this.missingCriteria.
                // We will use this list later to tell the user they don't have access to everything they are trying to query.
                this.missingCriteria = [];
                for( let criteriaQuery of manufacturerListQueryList ){
                    let found = false;

                    // Look at each available criteria
                    for( let f = 0; f < this.manufacturerList.length; f++ ){
                        if( criteriaQuery.toUpperCase() === this.manufacturerList[f].criteria.toUpperCase() ){
                            found = true;
                            this.onCheckboxClick( f, true );
                            this.commonService.setHaveUserInput( false );
                        }
                    }

                    // If one or more of the criteria we are trying to check/select is not in the list of available criteria.
                    if( !found ){
                        this.missingCriteria.push( 'Manufacturer: \"' + criteriaQuery + '\" is not available.' );
                    }
                }

                if( this.missingCriteria.length > 0 ){
                    // Each search category ( Collections, Image Modality, Manufacturer Sites ) adds to the over all list with this call
                    this.commonService.updateMissingCriteriaArray( this.missingCriteria );
                }

                // (Re)sort the list because a checked criteria is higher than unchecked.
                this.manufacturerList = this.sortService.criteriaSort( this.manufacturerList, this.cBox, this.sortNumChecked ); // sortNumChecked is an optional bool
                this.setSequenceValue();

            } );


        // ------ END of subscribes ------


        // Gets the list of Manufacturer Sites to be used as selectable search criteria in the 'Manufacturer Site' criteria panel in the Query section.
        this.setInitialManufacturerValues();

        if( !this.utilService.isNullOrUndefined( this.manufacturerList ) ){
            this.unCheckedCount = this.manufacturerList.length;
        }else{
            this.unCheckedCount = 0;
        }

        // Get persisted showManufacturerValues value.  Used to show, or collapse this category of criteria in the UI.
        this.showManufacturerValues = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_VALUES );
        if( this.utilService.isNullOrUndefined( this.showManufacturerValues ) ){
            this.showManufacturerValues = Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_VALUES_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_VALUES, this.showManufacturerValues );
        }

    } // End ngOnInit


    /**
     * Adds this manufacturer of search criteria to the query that the QueryUrlService will provide for "Share" -> "Share my query"
     */
    sendSelectedCriteriaString() {
        let criteriaString = '';
        for( let f = 0; f < this.cBox.length; f++ ){
            if( this.cBox[f] ){
                if( f > 0 ){
                    criteriaString += ',';
                }
                criteriaString += this.manufacturerList[f]['Manufacturer'];
            }
        }
        this.queryUrlService.update( this.queryUrlService.MANUFACTURER, criteriaString );
    }

    /**
     * Adds a 'seq' field to the manufacturerList, it is the sequence which the criteria are displayed.<br>
     * This is used by the HTML when displaying only part of manufacturerList.
     */
    setSequenceValue() {
        let len = this.manufacturerList.length;
        let seq = 0;
        if(this.utilService.isNullOrUndefined(this.manufacturerList[0].manufacturer)){
            this.manufacturerList[0].Manufacturer ='- Null -';
        }
        for( let f = 0; f < len; f++ ){
            this.manufacturerList[f].seq = seq;
            seq++;
        }
    }

    /**
     * This is called when the component first loads, or when it needs to be 'cleared' back to its initial state, like when a new user logs in.
     */
    setInitialManufacturerValues() {
        this.updateManufacturerValues( true );

        // This will tell the parameter service that it can send any query criteria that where passed in the URL
        this.initMonitorService.setManufacturerInit( true );
    }

    /**
     * Sets up the list of criteria and initializes it's check boxes.
     *
     * @param initCheckBox  Should all the check boxes be set to unchecked
     */
    updateManufacturerValues( initCheckBox ) {

        // If we are waiting on an update due to user (re)login
        if( this.utilService.isNullOrUndefined( this.completeManufacturerValues ) ){
            return;
        }

        // If this is the first time this is running just copy the data to the manufacturerList
        if( this.resetFlag ){
            this.manufacturerList = this.completeManufacturerValues;

        }else{
            // This will let us keep all of the criteria, but the ones that are not included in "data" will have a count of zero.
            this.manufacturerList = this.utilService.copyManufacturerObjectArray( this.completeManufacturerValuesHold );

            // for( let f = 0; f < this.manufacturerList.length; f++ ){
            //     this.manufacturerList[f].count = 0;
            // }

            // for( let dataCriteria of this.completeManufacturerValues ){
            //     for( let f = 0; f < this.manufacturerList.length; f++ ){
            //         if( this.manufacturerList[f].Manufacturer === dataCriteria.Manufacturer ){
            //             this.manufacturerList[f].count = dataCriteria.count;
            //         }
            //     }
            // }
        }

        if( (this.resetFlag) || (initCheckBox) ){
            this.resetFlag = false;
            this.cBox = [];
            let len = this.manufacturerList.length;
            for( let f = 0; f < len; f++ ){
                this.cBox[f] = false;
            }
            this.updateCheckboxCount();
        }

        this.manufacturerList = this.sortService.criteriaSort( this.manufacturerList, this.cBox, this.sortNumChecked );   // sortNumChecked is a bool
        this.manufacturerListHold = this.manufacturerList;

        this.setSequenceValue();
    }


    onMoreClick() {
        this.showAll = true;
    }

    onLessClick() {
        this.showAll = false;
    }


    /**
     * Called when a search criteria checkbox is checked or un checked.
     * Triggers an update of the 'Query', (re)runs the search, and sends the updated query to the query display at the top of the Search results section.
     *
     * @param i  Which checkbox
     * @param checked True if the checkbox is selected
     */
    onCheckboxClick( i, checked ) {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );

        this.cBox[i] = checked;
        this.updateCheckboxCount();

        let criteriaForQuery: string[] = [];

        // This category's data for the query, the 0th element is always the category name.
        criteriaForQuery.push( Consts.MANUFACTURER_CRITERIA );
        for( let f = 0; f < this.manufacturerList.length; f++ ){
            if( (!this.utilService.isNullOrUndefined( this.cBox[f] )) && (this.cBox[f]) ){
                criteriaForQuery.push( this.manufacturerList[f]['Manufacturer'] );
            }
        }

        // Tells SearchResultsTableComponent that the query has changed,
        // SearchResultsTableComponent will (re)run the query &
        // send updated query to the Query display at the top of the Search results section.
        this.commonService.updateQuery( criteriaForQuery );

        // (Re)sort the list because a checked criteria is higher than unchecked.
        this.manufacturerList = this.sortService.criteriaSort( this.manufacturerList, this.cBox, this.sortNumChecked );   // sortNumChecked is a bool

        // Update the query URL
        if( this.checkedCount === 0 ){
            this.queryUrlService.clear( this.queryUrlService.MANUFACTURER );
        }else{
            this.sendSelectedCriteriaString();
        }
    }

    /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param show
     */
    onShowManufacturerValuesClick( show: boolean ) {
        this.showManufacturerValues = show;
        this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_VALUES, this.showManufacturerValues );
    }

    /**
     * Clears the search text when the 'X' on the right side of the input is clicked.
     */
    onClearManufacturerSearchInputClick() {
        this.searchHasFocus = true;
        this.searchInput = '';
        this.onSearchChange();
    }

    /**
     * When the search, within this criteria list changes, NOT the data search.
     * @NOTE This is currently commented out for Manufacturer Sites
     */
    onSearchChange() {
        let tempList = [];
        let n = 0;

        for( let item of this.manufacturerListHold ){
            if(
                item['Manufacturer'].toUpperCase().includes( this.searchInput.toUpperCase() ) ||
                this.cBox[n]
            ){
                tempList.push( item );
                n++;
            }
        }
        this.manufacturerList = this.sortService.criteriaSort( tempList, this.cBox, this.sortNumChecked );   // sortNumChecked is a bool

        // This is not really needed, it is left from when I allowed the search to continue to be in effect when the text input was not visible.
        if( this.searchInput.length === 0 ){
            this.searchToolTip = 'Search';
        }else{
            this.searchToolTip = this.searchInput;
        }
    }

    /**
     * Toggles showing the search input box
     *
     * This is no longer used in Manufacturer Site, but they may want it back some day.
     *
     * @note Clears the search text input when showSearch is switched to true
     */
    onSearchGlassClick() {
        this.showSearch = (!this.showSearch);
        if( !this.showSearch ){
            this.manufacturerList = this.manufacturerListHold;
            this.onClearManufacturerSearchInputClick();
        }
    }


    onSearchTextOutFocus( n ) {
        // Text
        if( n === 0 ){
            this.searchTextHasFocus = false;
        }
        // X (Clear search text)
        if( n === 1 ){
            this.searchXHasFocus = false;
        }

        this.searchHasFocus = this.searchXHasFocus || this.searchTextHasFocus;
    }

    onSearchTextFocus( n ) {
        // Text
        if( n === 0 ){
            this.searchTextHasFocus = true;
        }
        // X (Clear search text)
        if( n === 1 ){
            this.searchXHasFocus = true;
        }
        this.searchHasFocus = true;
    }


    updateCheckboxCount() {
        let len = this.cBox.length;
        this.unCheckedCount = 0;
        this.checkedCount = 0;
        for( let f = 0; f < len; f++ ){
            if( this.cBox[f] ){
                this.checkedCount++;
            }else{
                this.unCheckedCount++;
            }
        }
    }


    /**
     * To reset everything to it's initial state after a new user has logged in.
     */
    resetAll() {
        this.setInitialManufacturerValues();
        this.onManufacturerClearAllClick( true ); // true will keep the updateQuery from being called.
        this.updateCheckboxCount();
    }


    /**
     *
     * @param {boolean} totalClear  true = the user has cleared the complete current query - no need to rerun the query
     */
    onManufacturerClearAllClick( totalClear: boolean ) {

        // Used when there is a query from URL parameters, so we didn't want to run the search until all query criteria where set,
        // but then a user has added query criteria after the URL parameter search. this flag tells us (if true) don't wait, run the search.
        this.commonService.setHaveUserInput( true );


        for( let f = 0; f < this.cBox.length; f++ ){
            this.cBox[f] = false;
        }

        this.checkedCount = 0;
        this.apiServerService.refreshCriteriaCounts();

        if( !totalClear ){
            let criteriaForQuery: string[] = [];
            criteriaForQuery.push( Consts.MANUFACTURER_CRITERIA );

            // Tells SearchResultsTableComponent that the query has changed,
            // SearchResultsTableComponent will (re)run the query &
            // send updated query to the Query display at the top of the Search results section.
            this.commonService.updateQuery( criteriaForQuery );
        }


        this.queryUrlService.clear( this.queryUrlService.MANUFACTURER );
        // Restore original criteria list and counts.
        this.completeManufacturerValues = this.utilService.copyManufacturerObjectArray( this.completeManufacturerValuesHold );
        this.updateManufacturerValues( true );
    }


    onSetSort( sortCriteria ) {
        // (Re)sort the list because a checked criteria is higher than unchecked.
        this.sortNumChecked = sortCriteria === 0;
        this.persistenceService.put( this.persistenceService.Field.MANUFACTURER_VALUES_SORT_BY_COUNT, this.sortNumChecked );
        this.manufacturerList = this.sortService.criteriaSort( this.manufacturerList, this.cBox, this.sortNumChecked ); // sortNumChecked is a bool
        this.setSequenceValue();

    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
