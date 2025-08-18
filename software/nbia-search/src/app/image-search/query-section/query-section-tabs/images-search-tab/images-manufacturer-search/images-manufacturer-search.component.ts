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

    /*  Each object in `manufacturerList` now carries its own
        `selected :boolean` flag – no separate parallel array needed. */

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

    completeManufacturerValuesHoldLoggedIn = null;
    completeManufacturerValuesHoldGuest = null; 

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
    sortNumChecked = false;
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
                this.completeManufacturerValues = this.utilService.copyCriteriaObjectArraywithFieldName(data, Consts.MANUFACTURER);

                this.completeManufacturerValues.forEach(item => {
                    item.unfilteredCount = item.count;
                    item.selected = false;
                });

                const isLoggedIn = this.commonService.getUserLoggedInStatus();
                if( this.completeManufacturerValuesHold == null || this.completeManufacturerValuesHoldLoggedIn == null || this.completeManufacturerValuesHoldGuest == null ){
                     // sample results from API
                    // [{Count:10, Authorized: 1}, {Manufacturer: "Carestream", Count: 10, Authorized: 1}, {Manufacturer: "CPS", Count: 10, Authorized: 1}, {Manufacturer: "Eigen", Count: 10, Authorized: 1},…]
                    if (this.completeManufacturerValues && this.completeManufacturerValues.length > 0) {
                        if (!this.completeManufacturerValues[0]?.Manufacturer) {
                            this.completeManufacturerValues[0] = { Manufacturer: 'NOT SPECIFIED' };
                        } 
                    }
                    this.completeManufacturerValuesHold        = this.completeManufacturerValues.map(v => ({ ...v }));
                    if(isLoggedIn){ 
                        this.completeManufacturerValuesHoldLoggedIn = this.completeManufacturerValues.map(v => ({ ...v }));
                    }else{
                        this.completeManufacturerValuesHoldGuest    = this.completeManufacturerValues.map(v => ({ ...v }));
                    }
                }else if( this.apiServerService.getSimpleSearchQueryHold() === null ){
                    this.completeManufacturerValues = this.completeManufacturerValuesHold.map(v => ({ ...v }));
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

        // Handle reset after login events (reloading criteria for the new user).
        this.handleLoginReset();

        // When counts of occurrences in the search results change
        this.apiServerService.criteriaCountUpdateEmitter
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(data => {
                this.onCriteriaCountsChange(data);
            });

        // This call is to trigger populating this.completeManufacturerValues (above) and wait for the results.
        // Note that this is not in the .subscribe and will run when ngOnInit is called.
        this.loadingDisplayService.setLoading( true, 'Loading Manufacturer query data. This could take up to a minute.' );

        // This is used when there is a URL parameter query to determine if the component initialization is complete, and it is okay to run the query.
        this.queryCriteriaInitService.startQueryCriteriaInit();
        //this.apiServerService.dataGet( 'v1/getManufacturerValues', '' );
        this.apiServerService.dataGet( 'v4/getManufacturerValuesAndCounts', '' );
        while( (this.utilService.isNullOrUndefined( this.completeManufacturerValues )) && (!errorFlag) ){
            await this.commonService.sleep( Consts.waitTime );
        }
        this.loadingDisplayService.setLoading( false, 'Done Loading query data' );
        
        // Called when the "Clear" button on the left side of the Display query at the top.
        this.handleSearchReset();

         // Process URL query parameters
        this.processUrlQueryParameters();

        // ------ END of subscribes ------


        // Gets the list of Manufacturer Sites to be used as selectable search Manufacturer in the 'Manufacturer Site' criteria panel in the Query section.
        this.setInitialManufacturerValues();

        // Get persisted showManufacturerValues value.  Used to show, or collapse this category of criteria in the UI.
        // Set initial manufacturer values
        this.showManufacturerValues = this.getShowManufacturerValues();

        // This will tell the parameter service that it can send any query Manufacturer that where passed in the URL
        this.initMonitorService.setManufacturerInit(true);

    } // End ngOnInit

    private getShowManufacturerValues(): boolean {
        let value = this.commonService.getCriteriaQueryShow(Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_VALUES);
        if( value == null ){
            this.commonService.setCriteriaQueryShow(Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_VALUES, Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_VALUES_DEFAULT);
            value = Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_VALUES_DEFAULT;
        }
        return value;
    }

    private handleSearchReset() {
        this.commonService.resetAllSimpleSearchEmitter.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(() => {
            const isLoggedIn = this.commonService.getUserLoggedInStatus();
            const loginStatusChanged = this.commonService.hasLoginStatusChanged();
            // If the user has logged status changed, we need to get the new list of criteria.
            if( loginStatusChanged ){
                if( isLoggedIn ){
                    this.completeManufacturerValuesHold = this.completeManufacturerValuesHoldLoggedIn.map(v => ({ ...v }));
                }else{
                    this.completeManufacturerValuesHold = this.completeManufacturerValuesHoldGuest.map(v => ({ ...v }));
                }
            }
            if (! this.completeManufacturerValuesHold ||  this.completeManufacturerValuesHold.length === 0) {
                this.completeManufacturerValues = [];
            }
            this.completeManufacturerValues = this.completeManufacturerValuesHold.map(v => ({ ...v }));  
            this.updateManufacturerValues(true);
            this.queryUrlService.clear(this.queryUrlService.MANUFACTURER);
        });
    }

    /**
     * Subscribes to resetAllSimpleSearchForLoginEmitter so that when a user logs in or out we can
     * reload all Manufacturer criteria according to the user’s access rights.
     */
    private handleLoginReset() {
        this.commonService.resetAllSimpleSearchForLoginEmitter
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(async () => {
                // Prevent the URL-triggered search from executing until criteria are ready.
                this.initMonitorService.setManufacturerRunning(true);

                // Local flag for breaking out of wait loops on error.
                let errorFlag = false;

                // Fully reset current state.
                this.resetFlag = true;
                this.completeManufacturerValues = null;

                // Re-request the full Manufacturer list and counts.
                this.apiServerService.dataGet('v4/getManufacturerValuesAndCounts', '');
                while (this.utilService.isNullOrUndefined(this.completeManufacturerValues) && !errorFlag) {
                    await this.commonService.sleep(Consts.waitTime);
                }

                // Save copies for future resets.
                this.completeManufacturerValues.forEach(item => {
                    item.unfilteredCount = item.count;
                    item.selected = false;
                });
                this.completeManufacturerValuesHold        = this.completeManufacturerValues.map(v => ({ ...v }));
                this.completeManufacturerValuesHoldLoggedIn = this.completeManufacturerValues.map(v => ({ ...v }));

                // Restore UI state depending on whether the URL contains search parameters.
                if (this.parameterService.haveUrlSimpleSearchParameters()) {
                    this.setInitialManufacturerValues();
                    //this.updateCheckboxCount();
                } else {
                    this.resetAll();
                }

                this.initMonitorService.setManufacturerRunning(false);
            });
    }

    private processUrlQueryParameters() {
        this.parameterService.parameterManufacturerEmitter.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(data => {
            const decodedCriteria = decodeURIComponent(data);
            const manufacturerListQueryList = JSON.parse(decodedCriteria);
    
            if (manufacturerListQueryList.length > 0) {
                this.missingCriteria = [];
    
                manufacturerListQueryList.forEach(criteriaQuery => {
                    const criteriaUpper = criteriaQuery.toUpperCase();
                    const matchedIndices = this.manufacturerList
                        .map((manufacturer, index) => manufacturer['Manufacturer'].toUpperCase() === criteriaUpper ? index : -1)
                        .filter(index => index !== -1);
    
                    if (matchedIndices.length > 0) {
                        matchedIndices.forEach(index => this.manufacturerList[index].selected = true);
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
            .filter(m => m.selected)
            .map(manufacturer => manufacturer['Manufacturer'] || 'NOT SPECIFIED');  // get the Manufacturer value
        
        const criteriaString = encodeURIComponent(JSON.stringify(selectedManufacturer));
        this.queryUrlService.update( this.queryUrlService.MANUFACTURER, criteriaString );
    }

    // refresh from the manufacturerList from the URL
    refreshFromURL() {
        // cBox is updated from the URL
        this.commonService.setHaveUserInput( true );
       
        const criteriaForQuery = [
            Consts.MANUFACTURER_CRITERIA,
            ...this.manufacturerList
                .filter(m => m.selected)
                .map(manufacturer => manufacturer['Manufacturer'])  // get the Manufacturer value       
        ];
        this.commonService.updateQuery( criteriaForQuery );

        this.sendSelectedCriteriaString();

    }
    /**
     * Adds a 'seq' field to the manufacturerList, it is the sequence which the Manufacturer are displayed.<br>
     * This is used by the HTML when displaying only part of manufacturerList.
     */
    setSequenceValue() {
      
        if(!this.manufacturerList[0]?.Manufacturer){
            this.manufacturerList[0].Manufacturer ='NOT SPECIFIED';
        }
        // Get sorted arrays while keeping `cBox` in sync
        this.getSortedManufacturersAndCBox();
    
        // Assign sequence values
        this.assignSequenceValues();
    }
    
    getSortedManufacturersAndCBox() {
        // merge manufacturerList and their `selected` flags
        const combinedArray = this.manufacturerList.map(item => ({
            manufacturer: item,
            isChecked: item.selected || false
        }));
        
        // Sort based on cBox first (true first), then Manufacturer alphabetically
        combinedArray.sort((a, b) => {
            if(b.isChecked !== a.isChecked){
                return b.isChecked - a.isChecked; // isChecked (true values) first
            }
            return a.manufacturer.Manufacturer.localeCompare(b.manufacturer.Manufacturer);
        });

        this.manufacturerList = combinedArray.map(item => item.manufacturer);

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
     * Updates, sorts, etc. when the search-result counts for each Manufacturer change.
     */
    async onCriteriaCountsChange(data) {
        if (this.utilService.isNullOrUndefined(data.res) || data.res.length < 1) {
            return;
        }

        // Find our Manufacturer data inside the response.
        const manufacturerCriteriaObj = data.res.find(c => c.criteria === 'Manufacturer')?.values;

        // Save current lists so we can restore check-boxes afterwards.
        const manufacturerListTemp = [...this.manufacturerList];
        const cBoxHold = [...this.manufacturerList.map(m => m.selected)]; // Keep track of selected states

        // If there is no active query, reset list to original.
        if (this.apiServerService.getSimpleSearchQueryHold() === null) {
            this.manufacturerList = this.manufacturerListHold;
            this.setInitialManufacturerValues();
        } else if (!this.utilService.isNullOrUndefined(manufacturerCriteriaObj)) {
            // Wait until complete list is available.
            while (this.utilService.isNullOrUndefined(this.completeManufacturerValues)) {
                await this.commonService.sleep(Consts.waitTime);
            }

            // Update counts in completeManufacturerValues
            this.completeManufacturerValues.forEach(item => {
                const match = manufacturerCriteriaObj.find(m => m.criteria === item.Manufacturer);
                item.count = match ? match.count : 0;
            });
        }

        // Re-build list while keeping counts aligned.
        this.updateManufacturerValues(false);

        // Restore checkbox selections based on Manufacturer name.
        this.manufacturerList.forEach((item, idx) => {
            const tempIdx = manufacturerListTemp.findIndex(tempItem => tempItem.Manufacturer === item.Manufacturer);
            if (tempIdx !== -1 && cBoxHold[tempIdx]) {
                item.selected = true;
            } else {
                item.selected = false;
            }
        });

        // Resort with checked items on top.
        this.getSortedManufacturersAndCBox();
        this.assignSequenceValues();
    }

    /**
     * This is called when the component first loads, or when it needs to be 'cleared' back to its initial state, like when a new user logs in.
     */
    setInitialManufacturerValues() {
         // If we are waiting on an update due to user (re)login
         if( !this.completeManufacturerValues ){
            return;
        }
        this.manufacturerList = this.completeManufacturerValues.map(v => ({ ...v }));
        this.manufacturerListHold = this.manufacturerList;

        if(this.manufacturerList && this.manufacturerList.length > 0){
            this.unCheckedCount = this.manufacturerList.length;
            this.checkedCount = 0;
        }else{
            this.unCheckedCount = 0;
            this.checkedCount = 0;
        }

        this.setSequenceValue() ;
        this.manufacturerListHold = [...this.manufacturerList];
    
    }

    /**
     * Sets up the list of manufacturer and initializes selected.
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
            : this.completeManufacturerValuesHold.map(v => ({ ...v }));

        // hanlde checkbox state
        if( this.resetFlag || initCheckBox ){
            this.resetFlag = false;
            this.manufacturerList.forEach(m => m.selected = false);
            this.updateCheckboxCount();
        }

        this.setSequenceValue() ;
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
        this.manufacturerList[index].selected = checked;
        this.updateCheckboxCount();
        this.setSequenceValue() ;
    }

    updateQueryCriteria() {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );
         // This category's data for the query, the 0th element is always the category name.
        let criteriaForQuery: string[] = [Consts.MANUFACTURER_CRITERIA];

        this.manufacturerList.forEach((manufacturer, index) => {
            if (manufacturer.selected) {
                criteriaForQuery.push(manufacturer['Manufacturer']);
            }
        });

        this.commonService.updateQuery( criteriaForQuery );

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
        const searchTerm = this.searchInput.trim().toUpperCase();
        const isSearchEmpty = searchTerm.length === 0;

        if( isSearchEmpty ){
            this.adjustSequencesFromSearch( this.manufacturerListHold);
        }else{
            // Build a Set of checked manufacturers directly
            const checkedManufacturers = new Set();
            for (let i = 0; i < this.manufacturerList.length; i++) {
                if (this.manufacturerList[i].selected) {
                    checkedManufacturers.add(this.manufacturerList[i].Manufacturer);
                }
            }

            const tempList = this.manufacturerListHold.filter(item => 
                checkedManufacturers.has(item.Manufacturer) || item.Manufacturer.toUpperCase().includes(searchTerm)      
            );
        
            if(tempList.length > 0){
                this.adjustSequencesFromSearch(tempList);
            }
        }

        this.searchToolTip = isSearchEmpty ? 'Search' : this.searchInput;
        this.showAllForSearch = !isSearchEmpty;

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
           //this.manufacturerList = this.manufacturerListHold;
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
        this.checkedCount = this.manufacturerList.filter(m => m.selected).length;
        this.unCheckedCount = this.manufacturerList.length - this.checkedCount;
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
        this.commonService.setHaveUserInput( true );

        this.manufacturerList.forEach(m => m.selected = false);
        this.checkedCount = 0;
      //  this.apiServerService.refreshCriteriaCounts();
        let criteriaForQuery: string[] = [];
        criteriaForQuery.push( Consts.MANUFACTURER_CRITERIA );
        this.commonService.updateQuery( criteriaForQuery );
        this.queryUrlService.clear( this.queryUrlService.MANUFACTURER );
        // Restore original Manufacturer list and counts.
        this.completeManufacturerValues = this.completeManufacturerValuesHold.map(v => ({ ...v }));
        this.updateManufacturerValues( true );
    }   

    onSetSort( sortCriteria ) {
        // (Re)sort the list because a checked Manufacturer is higher than unchecked.
        this.sortNumChecked = sortCriteria === 0;
        this.persistenceService.put( this.persistenceService.Field.MANUFACTURER_VALUES_SORT_BY_COUNT, this.sortNumChecked );
        this.setSequenceValue();
    }

    adjustSequencesFromSearch(tList) {
        // tlist as 
        //{Manufacturer: 'CPS', seq: 0}

        if (!tList || tList.length === 0) return;
        const preListLength = this.manufacturerList.length;
        const originalIndexMap = new Map();
        this.manufacturerList.forEach((item, index) => originalIndexMap.set(item.Manufacturer, index))

        const newCBox = tList.map(item =>  {
            const originalIndex = originalIndexMap.get(item.Manufacturer);
            return originalIndex !== undefined ? this.manufacturerListHold[originalIndex].selected || false : false;
        });
        
        this.manufacturerList = tList.map((item, index) => ({ ...item, seq: index }));

        this.manufacturerList.forEach((item, idx) => {
            item.selected = newCBox[idx];
        });

        if( !(preListLength > this.manufacturerList.length) ){
            this.setSequenceValue();
        }

        this.updateCheckboxCount();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
