import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Consts } from '@app/consts';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { SearchResultsSortService } from '@app/image-search/data-section/data-section-tabs/search-results/search-results-sort.service';
import { Properties } from '@assets/properties';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { Subject, from, of } from 'rxjs';
import { takeUntil, filter , catchError, switchMap, tap} from 'rxjs/operators';
import { UtilService } from '@app/common/services/util.service';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { QueryCriteriaInitService } from '@app/common/services/query-criteria-init.service';
import { HttpClient } from '@angular/common/http';

/**
 * The list of selectable Manufacturer that make up the Manufacturer LIST of the search query.
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
    manufacturerList: any[] = [];

    /**
     * Used by the UI search within this Manufacturer list (with the red magnifying glass), NOT the data search.
     */
    manufacturerListHold: any[] = [];
    resetFlag: boolean = false;

    /**
     * For hide or show this group of Manufacturer when the arrows next to the heading are clicked.
     */
    showManufacturerValues: boolean = false;

    /**
     * For the 'X More' and 'Less...' in the list of Manufacturer.
     *
     * @type {boolean}
     */
    showAll: boolean = false;

    /**
     * Used in the HTML when calculating how many Manufacturer to display.  Checked Manufacturer are always shown.
     */
    unCheckedCount: number = 0;

    /**
     * Used in the HTML when calculating how many Manufacturer to display.  Checked Manufacturer are always shown.
     */
    checkedCount: number = 0;

    /**
     * Tracks which Manufacturer have been selected, used in the code, and the HTML.
     *
     * @type {Array}
     */
    cBox = [];

    /**
     * Used by the UI search within this Manufacturer list (with the red magnifying glass), NOT the data search.
     *
     * @type {boolean}
     */
    searchHasFocus: boolean = false;
    searchXHasFocus: boolean = false;
    searchTextHasFocus: boolean = false;
    searchInput = '';

        /**
     * When the Search through the Collections (The red magnifying glass) is active we will always show the full list regardless of showAll.
     *
     * @type {boolean}
     */
        showAllForSearch = false;


    searchToolTip = 'Search';
    showSearch: boolean = false;
    inCollection = false;

    completeManufacturerValues;
    completeManufacturerValuesHold: any[] = [];

    /**
     * If a query passed in the URL has Manufacturer that don't exist in our current list, they are put in the array, used to alert the user.
     *
     * @type {any[]}
     */
    missingCriteria: any[] = [];

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
                 private persistenceService: PersistenceService, private queryCriteriaInitService: QueryCriteriaInitService , private http: HttpClient) {
    }

    async ngOnInit() {

        /**
         * Set to true when a sbuscribe returns an error.
         * It is used where we are waiting on subscribed data, to tell us to stop waiting, there will be no data.
         *
         * @type {boolean}
         */
        let errorFlag = false;

        // ------------------------------------------------------------------------------------------
        // Get the full complete Manufacturer list.
        // ------------------------------------------------------------------------------------------
        this.apiServerService.getManufacturerValuesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                try {
                this.queryCriteriaInitService.endQueryCriteriaInit();
                this.completeManufacturerValues = data;
                // sample results from API
                // [{}, {Manufacturer: "Carestream"}, {Manufacturer: "CPS"}, {Manufacturer: "Eigen"},…]
                if (this.completeManufacturerValues && this.completeManufacturerValues.length > 0) {
                    if (!this.completeManufacturerValues[0]?.Manufacturer) {
                        this.completeManufacturerValues[0] = { Manufacturer: '- NOT SPECIFIED -' };
                    } 
                }

                // If completeManufacturerValuesHold is null, this is the initial call.
                // completeManufacturerValuesHold lets us reset completeManufacturerValues when ever needed.
                if( this.completeManufacturerValuesHold == null || (this.completeManufacturerValuesHold && this.completeManufacturerValuesHold.length < 1)){
                    this.completeManufacturerValuesHold = this.utilService.copyManufacturerObjectArray( this.completeManufacturerValues );
                }else if( this.apiServerService.getSimpleSearchQueryHold() == null ){
                     // There is no query (anymore) reset the list of Manufacturer to the initial original values.
                    this.completeManufacturerValues = this.utilService.copyManufacturerObjectArray( this.completeManufacturerValuesHold );
                }
            } catch (error) {
                console.error('Error in getManufacturerValuesEmitter.subscribe: ', error);
            }

            }
        );

        // React to errors when getting the full complete Manufacturer list.
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
        this.loadingDisplayService.setLoading( true, 'Loading Manufacturer query data. This could take up to a minute.' );

        // This is used when there is a URL parameter query to determine if the component initialization is complete, and it is okay to run the query.
        this.queryCriteriaInitService.startQueryCriteriaInit();
        this.apiServerService.dataGet( 'v1/getManufacturerValues', '' );
        while( (this.utilService.isNullOrUndefined( this.completeManufacturerValues )) && (!errorFlag) ){
            await this.commonService.sleep( Consts.waitTime );
        }
        this.loadingDisplayService.setLoading( false, 'Done Loading query data' );
        
        // Called when the "Clear" button on the left side of the Display query at the top.
        this.handleSearchReset();

         // Process URL query parameters
        // this.processUrlQueryParameters();

        // ------ END of subscribes ------


        // Gets the list of Manufacturer Sites to be used as selectable search Manufacturer in the 'Manufacturer Site' criteria panel in the Query section.
        this.setInitialManufacturerValues();

        // Get persisted showManufacturerValues value.  Used to show, or collapse this category of criteria in the UI.
        // Set initial manufacturer values
        //this.getShowManufacturerValues();

        // This will tell the parameter service that it can send any query Manufacturer that where passed in the URL
        this.initMonitorService.setManufacturerInit(false);

    } // End ngOnInit

    private getShowManufacturerValues(): boolean {
        let value = this.commonService.getCriteriaQueryShow(Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_VALUES);
        return value != null ? value : Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_VALUES_DEFAULT;
    }

    private handleSearchReset() {
        this.commonService.resetAllSimpleSearchEmitter.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(() => {
            this.completeManufacturerValues = this.utilService.copyManufacturerObjectArray(this.completeManufacturerValuesHold);
            this.updateManufacturerValues(true);
            this.queryUrlService.clear(this.queryUrlService.MANUFACTURER);
        });
    }

    private processUrlQueryParameters() {
        this.parameterService.parameterManufacturerEmitter.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(data => {
            const manufacturerListQueryList = String(data).replace(/,$/, "").split(/\s*,\s*/);
    
            if (manufacturerListQueryList.length > 0) {
                this.missingCriteria = [];
    
                manufacturerListQueryList.forEach(criteriaQuery => {
                    const criteriaUpper = criteriaQuery.toUpperCase();
                    const matchedIndices = this.completeManufacturerValues
                        .map((manufacturer, index) => manufacturer['Manufacturer'].toUpperCase() === criteriaUpper ? index : -1)
                        .filter(index => index !== -1);
    
                    if (matchedIndices.length > 0) {
                        matchedIndices.forEach(index => this.cBox[index] = true);
                    } else {
                        this.missingCriteria.push(`Manufacturer: "${criteriaQuery}" is not available.`);
                    }
                });
    
                this.refreshFromURL();
                this.showManufacturerValues = true;
                if (this.missingCriteria.length > 0) {
                    this.commonService.updateMissingCriteriaArray(this.missingCriteria);
                }
                this.updateCheckboxCount();
                this.setSequenceValue() ;
                this.commonService.setHaveUserInput(false);

            } else {
                console.error('Error in parameterManufacturerEmitter.subscribe: Invalid data');
            }
        });
    }


    /**
     * Adds this manufacturer of search criteria to the query that the QueryUrlService will provide for "Share" -> "Share my query"
     */
    sendSelectedCriteriaString() {
        const selectedManufacturer = this.manufacturerList
            .filter((manufacturer, index) => this.cBox[index])
            .map(manufacturer => manufacturer['Manufacturer']?.replace(/,/g, ' ') || '- NOT SPECIFIED -');  // get the Manufacturer value
        
        const criteriaString = encodeURIComponent(selectedManufacturer.join(','));
        this.queryUrlService.update( this.queryUrlService.MANUFACTURER, criteriaString );
    }

    // refresh from the manufacturerList from the URL
    refreshFromURL() {
        // cBox is updated from the URL
        this.commonService.setHaveUserInput( true );
       
        const criteriaForQuery = [
            Consts.MANUFACTURER_CRITERIA,
            ...this.manufacturerList
                .filter((manufacturer, index) => this.cBox[index])
                .map(manufacturer => manufacturer['Manufacturer'])  // get the Manufacturer value       
        ];

        // Tells SearchResultsTableComponent that the query has changed,
        // SearchResultsTableComponent will (re)run the query &
        // send updated query to the Query display at the top of the Search results section.
        this.commonService.updateQuery( criteriaForQuery );

        this.sendSelectedCriteriaString();

    }
    /**
     * Adds a 'seq' field to the manufacturerList, it is the sequence which the Manufacturer are displayed.<br>
     * This is used by the HTML when displaying only part of manufacturerList.
     */
    setSequenceValue() {
      
        if(!this.manufacturerList[0]?.Manufacturer){
            this.manufacturerList[0].Manufacturer ='- NOT SPECIFIED -';
        }
        // Get sorted arrays while keeping `cBox` in sync
        this.getSortedManufacturersAndCBox();
    
        // Assign sequence values
        this.assignSequenceValues();
    }
    
    getSortedManufacturersAndCBox() {
        // merge manufacturerList and cBox[] values
        const combinedArray = this.manufacturerList.map((item, index) => ({
            manufacturer: item, 
            isChecked: this.cBox[index] || false    }));
        
        // Sort based on cBox first (true first), then Manufacturer alphabetically
        combinedArray.sort((a, b) => {
            if(b.isChecked !== a.isChecked){
                return b.isChecked - a.isChecked; // isChecked (true values) first
            }
            return a.manufacturer.Manufacturer.localeCompare(b.manufacturer.Manufacturer);
        });

        this.manufacturerList = combinedArray.map(item => item.manufacturer);
        this.cBox = combinedArray.map(item => item.isChecked);

    }
    
    /**
     * Assigns sequence values (`seq`) to the manufacturerList.
     */
    assignSequenceValues() {
        this.manufacturerList.forEach((item, index) => {
            item.seq = index;
        });
    }

    /**
     * This is called when the component first loads, or when it needs to be 'cleared' back to its initial state, like when a new user logs in.
     */
    setInitialManufacturerValues() {
        this.updateManufacturerValues( true );
    }

    /**
     * Sets up the list of manufacturer and initializes it's check boxes.
     *
     * @param initCheckBox  Should all the check boxes be set to unchecked
     */
    updateManufacturerValues( initCheckBox ) {

        // If we are waiting on an update due to user (re)login
        if( !this.completeManufacturerValues ){
            return;
        }

        // If this is the first time this is running just copy the data to the manufacturerList
        // This will let us keep all of the manufacturerList, but the ones that are not included in "data" will have a count of zero.
        this.manufacturerList = this.resetFlag 
            ? this.completeManufacturerValues
            : this.utilService.copyManufacturerObjectArray( this.completeManufacturerValuesHold );

        // hanlde checkbox state
        if( this.resetFlag || initCheckBox ){
            this.resetFlag = false;
            this.cBox = new Array( this.manufacturerList.length ).fill( false );
            this.updateCheckboxCount();
        }

        this.setSequenceValue() ;

        // resort only when changed
        // if(!this.resetFlag) {
        //     this.setSequenceValue() ;
        // }
        this.manufacturerListHold = [...this.manufacturerList];
    }


    onMoreClick() {
        this.showAll = true;
    }

    onLessClick() {
        this.showAll = false;
    }


    /**
     * Called when a search Manufacturer checkbox is checked or un checked.
     * Triggers an update of the 'Query', (re)runs the search, and sends the updated query to the query display at the top of the Search results section.
     *
     * @param i  Which checkbox
     * @param checked True if the checkbox is selected
     */
    onCheckboxClick( index: number, checked: boolean ) {
        this.updateCheckboxState(index, checked);
        this.updateQueryCriteria();
    }

    updateCheckboxState(index: number, checked: boolean) {
        this.cBox[index] = checked;
        this.updateCheckboxCount();
        this.setSequenceValue() ;
    }

    updateQueryCriteria() {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );
         // This category's data for the query, the 0th element is always the category name.
        let criteriaForQuery: string[] = [Consts.MANUFACTURER_CRITERIA];

        this.manufacturerList.forEach((manufacturer, index) => {
            if (this.cBox[index]) {
                criteriaForQuery.push(manufacturer['Manufacturer']);
            }
        });

        // Tells SearchResultsTableComponent that the query has changed,
        // SearchResultsTableComponent will (re)run the query &
        // send updated query to the Query display at the top of the Search results section.
        this.commonService.updateQuery( criteriaForQuery );

        // (Re)sort the list because a checked Manufacturer is higher than unchecked.
        // moved into updateCheckboxCount
       // this.setSequenceValue() ;
       // this.manufacturerList = this.sortService.criteriaSort( this.manufacturerList, this.cBox, this.sortNumChecked );   // sortNumChecked is a bool

        // Update the query URL
        if( this.checkedCount === 0 ){
            this.queryUrlService.clear( this.queryUrlService.MANUFACTURER );
        }else{
            this.sendSelectedCriteriaString();
        }
    }

    /**
     * Hides or shows this group of Manufacturer when the arrows next to the heading are clicked.
     *
     * @param show
     */
    onShowManufacturerValuesClick( show: boolean ) {
        this.showManufacturerValues = show;
    }

    // following functions are for the search within this Manufacturer list (with the red magnifying glass), NOT the data search.
    /**
     * Clears the search text when the 'X' on the right side of the input is clicked.
     */
    onClearManufacturerSearchInputClick() {
        this.searchHasFocus = true;
        this.searchInput = '';
        this.onSearchChange();
    }

    /**
     * When the search, within this Manufacturer list changes, NOT the data search.
     * @NOTE This is currently commented out for Manufacturer Sites
     */
    onSearchChange() {
        let tempList = [];
        let n = 0;
        for( let item of this.manufacturerList ){
            if(
                item['Manufacturer'].toUpperCase().includes( this.searchInput.toUpperCase() ) ||
                this.cBox[n]
            ){
                tempList.push( item );
                n++;
            }
        }
        
        this.manufacturerList = this.sortService.criteriaSort( tempList, this.cBox, false );  
        this.setSequenceValue() ;
        // This is not really needed, it is left from when I allowed the search to continue to be in effect when the text input was not visible.
        if( this.searchInput.length === 0 ){
            this.searchToolTip = 'Search';
            this.showAllForSearch = false;
        }else{
            this.searchToolTip = this.searchInput;
            this.showAllForSearch = true;
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
        this.checkedCount = this.cBox.filter(checked => checked).length;
        this.unCheckedCount = this.cBox.length - this.checkedCount;
    }


    /**
     * To reset everything to it's initial state after a new user has logged in.
     */
    resetAll() {
        this.setInitialManufacturerValues();
        this.onManufacturerClearAllClick( true ); // true will keep the updateQuery from being called.
        this.updateCheckboxCount();
        this.setSequenceValue() ;
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
      //  this.apiServerService.refreshCriteriaCounts();
        let criteriaForQuery: string[] = [];
        criteriaForQuery.push( Consts.MANUFACTURER_CRITERIA );

            // Tells SearchResultsTableComponent that the query has changed,
            // SearchResultsTableComponent will (re)run the query &
            // send updated query to the Query display at the top of the Search results section.
        this.commonService.updateQuery( criteriaForQuery );
        
        this.queryUrlService.clear( this.queryUrlService.MANUFACTURER );
        // Restore original Manufacturer list and counts.
        this.completeManufacturerValues = this.utilService.copyManufacturerObjectArray( this.completeManufacturerValuesHold );
        this.updateManufacturerValues( true );
    }


    onSetSort( sortCriteria ) {
        // (Re)sort the list because a checked Manufacturer is higher than unchecked.
        this.sortNumChecked = sortCriteria === 0;
        this.persistenceService.put( this.persistenceService.Field.MANUFACTURER_VALUES_SORT_BY_COUNT, this.sortNumChecked );
        //this.manufacturerList = this.sortService.criteriaSort( this.manufacturerList, this.cBox, this.sortNumChecked ); // sortNumChecked is a bool
        this.setSequenceValue();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
