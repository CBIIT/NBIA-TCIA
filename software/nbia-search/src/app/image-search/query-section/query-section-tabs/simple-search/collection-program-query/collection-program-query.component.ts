import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Consts } from '@app/consts';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { SearchResultsSortService } from '@app/image-search/data-section/data-section-tabs/search-results/search-results-sort.service';
import { Properties } from '@assets/properties';
import { ParameterService } from '@app/common/services/parameter.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { CollectionDescriptionsService } from '@app/common/services/collection-descriptions.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { UtilService } from '@app/common/services/util.service';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';
import { QueryCriteriaInitService } from '@app/common/services/query-criteria-init.service';


/**
 * The list of selectable criteria that make up the Collections part of the search query.
 */
@Component( {
    selector: 'nbia-collection-program-query',
    templateUrl: './collection-program-query.component.html',
    styleUrls: ['../simple-search.component.scss', './collection-program-query.component.scss']
} )


export class CollectionProgramQueryComponent implements OnInit, OnDestroy{

    /**
     * The list used by the HTML.
     */
    criteriaList;

    /**
     * Used by the UI search within this criteria list (with the red magnifying glass), NOT the data search.
     */
    criteriaListHold;
    resetFlag = true;

    /**
     * For hide or show this group of criteria when the arrows next to the heading are clicked.
     */
    showTciaProgramList;

    /*
    * one per program index
    */
    showAllCollections: boolean [] = [];
    expandedPrograms: boolean [] = [];

    /**
     * For the 'X More' and 'Less...' in the list of criteria.
     *
     * @type {boolean}
     */
    showAll = false;

    /**
     * When the Search through the Collections (The red magnifying glass) is active we will always show the full list regardless of showAll.
     *
     * @type {boolean}
     */
    showAllForSearch = false;

    /**
     * Used in the HTML when calculating how many criteria to display.  Checked criteria are always shown.
     */
    uncheckedProgramCount = 1;

    /**
     * Used in the HTML when calculating how many criteria to display.  Checked criteria are always shown.
     */
    checkedProgramCount = 0;

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
    inCollection = false;

    /**
     * Used to when displaying Collection description.
     *
     * @type {boolean}
     */
    showToolTip = false;
    toolTipText = '';
    toolTipY = 242;
    toolTipStayOn = false;
    toolTipHeading = '';
    toolTipCounter = 0;
    toolTipStartDelay = 700; // in 1/1000 of a second

    /**
     * For sorting of Collections.
     * We will over write this if there is a saved value in the browser cookie.
     *
     * @type {boolean}
     */
    sortNumChecked = false;
    sortAlphaChecked = !this.sortNumChecked;

    /**
     * The full original Criteria list from the server.
     * Ex.:
     * [
     *     {
     *         "criteria":"4D-Lung",
     *         "count":"20"
     *     },
     *     {
     *         "criteria":"BREAST-DIAGNOSIS",
     *         "count":"88"
     *     },...
     * ]
     */
    completeCriteriaList;
    completeCriteriaListHold = null;

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

    descriptionTooltipDelay = 1000;

    tciaProgramList = [];
    tciaProgramListHold = null;
    completeTciaProgramList = [];
    completeTciaProgramListHold = null;

    /**
     * Used to clean up subscribes on the way out to prevent memory leak.
     *
     * @type {Subject<boolean>}
     */
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private apiServerService: ApiServerService,
                 private sortService: SearchResultsSortService, private parameterService: ParameterService,
                 private initMonitorService: InitMonitorService, private queryUrlService: QueryUrlService,
                 private collectionDescriptionsService: CollectionDescriptionsService, private persistenceService: PersistenceService,
                 private utilService: UtilService, private loadingDisplayService: LoadingDisplayService,
                 private queryCriteriaInitService: QueryCriteriaInitService ) {
    }

    async ngOnInit() {

        /**
         * Set to true when a subscribe returns an error.
         * It is used where we are waiting on subscribed data, to tell us to stop waiting, there will be no data.
         *
         * @type {boolean}
         */
        let errorFlag = false;

        // Update the Collections sort criteria from a persisted value (Alpha or NUm).
        this.sortNumChecked = this.persistenceService.get( this.persistenceService.Field.COLLECTIONS_SORT_BY_COUNT );
        // If there is no persisted value, use the same one as the others (Sort by count).
        if( this.utilService.isNullOrUndefined( this.sortNumChecked ) ){
            this.sortNumChecked = Properties.SORT_COLLECTIONS_BY_COUNT;
        }
        this.sortAlphaChecked = !this.sortNumChecked;

        // ------------------------------------------------------------------------------------------
        // Get the full complete criteria list.
        // ------------------------------------------------------------------------------------------
        this.apiServerService.getCollectionValuesAndCountsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.queryCriteriaInitService.endQueryCriteriaInit();
                this.completeCriteriaList = data;

                // If completeCriteriaListHold is null, this is the initial call.
                // completeCriteriaListHold lets us reset completeCriteriaList when ever needed.
                if( this.completeCriteriaListHold === null ){
                    this.completeCriteriaListHold = this.utilService.copyCriteriaObjectArray( this.completeCriteriaList );
                }

                // There is no query (anymore) reset the list of criteria to the initial original values.
                else if( this.apiServerService.getSimpleSearchQueryHold() === null ){
                    this.completeCriteriaList = this.utilService.copyCriteriaObjectArray( this.completeCriteriaListHold );
                }

            }
        );

        // React to errors when getting the full complete criteria list.
        this.apiServerService.getCollectionValuesAndCountsErrorEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( err ) => {
                errorFlag = true;
                // TODO these errors need to be vetted, some are harmless and shouldn't interrupt the UI flow
                // alert( 'error: ' + err );
                this.queryCriteriaInitService.endQueryCriteriaInit();
            }
        );

        // This call is to trigger populating this.completeCriteriaList (above) and wait for the results.
        // Note that this is not in the .subscribe and will run when ngOnInit is called.
        this.loadingDisplayService.setLoading( true, 'Loading query data. This could take up to a minute.' );
        // This is used when there is a URL parameter query to determine if the component initialization is complete, and it is okay to run the query.
        this.queryCriteriaInitService.startQueryCriteriaInit();
        this.apiServerService.dataGet( 'getCollectionValuesAndCounts', '' );
        let tempCount = 0;
        while( (this.utilService.isNullOrUndefined( this.completeCriteriaList )) && (!errorFlag) && (tempCount < 500) ){
            await this.commonService.sleep( Consts.waitTime );
        }
        this.loadingDisplayService.setLoading( false, 'Done updateCriteriaList' );
        await this.loadNbiaProgramList();

        // ------------------------------------------------------------------------------------------


        // When the number of search results changes. data is the search results count
        // If data equals -1 there is no search, so no results.
        // If data equals 0 there is a search, but no search results.
        // If there is a search, but no search results, all counts are zeroed
        this.commonService.searchResultsCountEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( this.commonService.getResultsDisplayMode() === Consts.SIMPLE_SEARCH ){
                    // data  0 = No results from a search,  -1 = No search

                    // If a Simple Search returned no results
                    if( data === 0 ){
                        for( let completeCriteria of this.criteriaList ){
                            completeCriteria.count = 0;
                        }
                    }

                    // No search, restore criteria and counts to their original state.
                    else if( data === -1 ){
                        this.onCollectionsClearAllClick( true );
                    }
                }
            }
        );


        // When counts of occurrences in the search results changes
        this.apiServerService.criteriaCountUpdateEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.onCriteriaCountsChange( data );

                // If there is a search string in the search within Collections reset the search effect.
                if(this.showSearch && this.searchInput?.trim()) this.onSearchChange();
            }
        );


        // Reload the list of search criteria because a user has logged in,
        // they may have different access to available search criteria.
        this.commonService.resetAllSimpleSearchForLoginEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async() => {
                // This is used when a query included in the URL is to be rerun when a user logs in,
                // so the query knows not to rerun until all the search criteria are set. @see LoginComponent.

                this.initMonitorService.setCollectionsRunning( true );

                // The complete reset we need.
                this.resetFlag = true;
                this.completeCriteriaList = undefined;

                // Get the list of all Collections in the database and the number of records which contain each collection.
                this.apiServerService.dataGet( 'getCollectionValuesAndCounts', '' );

                while( (this.completeCriteriaList === undefined) && (!errorFlag) ){
                    await this.commonService.sleep( Consts.waitTime );
                }

                this.completeCriteriaListHold = this.utilService.copyCriteriaObjectArray( this.completeCriteriaList );

                // Was there a search passed in with the URL
                if( this.parameterService.haveUrlSimpleSearchParameters() ){
                    this.initTciaProgramList();
                    this.updateCheckboxCount();
                }else{
                    this.initTciaProgramList();
                    this.onCollectionsClearAllClick( true ); // true will keep the updateQuery from being called.
                    this.updateCheckboxCount();
                }
                this.initMonitorService.setCollectionsRunning( false );
            }
        );


        // Called when the "Clear" button on the left side of the Display query at the top.
        this.commonService.resetAllSimpleSearchEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.completeTciaProgramList = [...this.completeTciaProgramListHold];
                this.resetTciaProgramListState();
                this.completeCriteriaList = this.utilService.copyCriteriaObjectArray( this.completeCriteriaListHold );
                this.queryUrlService.clear( this.queryUrlService.COLLECTIONS );          
            }
        );

         // Process URL query parameters
        this.processUrlQueryParameters();


        // ------ END of subscribes ------


        // Gets the list of Collections to be used as selectable search criteria in the 'Collections' criteria panel in the Query section.
       // this.setInitialTciaProgramList();

        if( !this.utilService.isNullOrUndefined( this.tciaProgramList ) ){
            this.uncheckedProgramCount = this.tciaProgramList.length;
        }else{
            this.uncheckedProgramCount = 0;
        }

        // Get persisted showTciaProgramList value.  Used to show, or collapse this category of criteria in the UI.
        this.showTciaProgramList = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_COLLECTIONS );
        if( this.utilService.isNullOrUndefined( this.showTciaProgramList ) ){
            this.showTciaProgramList = Consts.SHOW_CRITERIA_QUERY_COLLECTIONS_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_COLLECTIONS, this.showTciaProgramList );
        }

        this.initMonitorService.setCollectionsInit( true );

    } // End ngOnInit

    private processUrlQueryParameters() {
        this.parameterService.parameterCollectionEmitter.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(
            data => {
            const criteriaListQueryList = String(data).replace(/,$/, "").split(/\s*,\s*/);
           
            if (criteriaListQueryList.length > 0) {
                this.missingCriteria = [];
                const collectionsSet = new Set(criteriaListQueryList.map(name => name.toUpperCase()));
                const matchedCollections = new Set();
    
                this.tciaProgramList.forEach(program => {
                    program.relatedCollectionsList.forEach(collection => {
                      const name = collection.criteria?.toUpperCase();
                      if (name && collectionsSet.has(name)) {
                        collection.selected = true;
                        matchedCollections.add(name);
                      }
                    });
                  });

                  // Update program-level selection states
                this.tciaProgramList.forEach(program => {
                    const totalCollections = program.relatedCollectionsList.length;
                    const selectedCount = program.relatedCollectionsList.filter(col => col.selected).length;
                
                    program.selected = selectedCount === totalCollections && totalCollections > 0;
                    program.indeterminate = selectedCount > 0 && selectedCount < totalCollections;
                });

                this.sortTciaProgramListPrograms();
                this.sortTciaProgramList();
                
                  // Find unmatched names
                  criteriaListQueryList.forEach(name => {
                    if (!matchedCollections.has(name.toUpperCase())) {
                        this.missingCriteria.push(name);
                    }
                  });
                this.refreshFromURL();
                this.commonService.setHaveUserInput(false);
                this.showTciaProgramList = true;
                if (this.missingCriteria.length > 0) {
                    this.commonService.updateMissingCriteriaArray(this.missingCriteria);
                }
                this.updateCheckboxCount();
                //this.setSequenceValue() ;
                

            } else {
                console.error('Error in parameterCollectionsEmitter.subscribe: Invalid data');
            }
        });
    }

    // refresh from the manufacturerList from the URL
    refreshFromURL() {
         // selected status is updated from the URL
        this.commonService.setHaveUserInput( true );
        const selectedCollections  = this.getSelectedCollections();
       
        let criteriaForQuery: string[] = [];

        // This category's data for the query, the 0th element is always the category name.
        criteriaForQuery.push( Consts.COLLECTION_CRITERIA );
        if (selectedCollections.length > 0) {
            criteriaForQuery.push(...selectedCollections.map(item => item.collection));
        }
        this.commonService.updateQuery( criteriaForQuery );

        this.sendSelectedCriteriaString();

    }

    getSelectedCollections(): any[] {
        const selectedCollections: any[] = [];
      
        this.tciaProgramList.forEach(program => {
          program.relatedCollectionsList.forEach(collection => {
            if (collection.selected) {
              selectedCollections.push({
                program: program.programName,
                collection: collection.criteria
              });
            }
          });
        });
  
        return selectedCollections;
    }

    /**
     * Adds this category of search criteria to the query that the QueryUrlService will provide for "Share" -> "Share my query"
     */
    sendSelectedCriteriaString() {
        let criteriaString = '';
        this.tciaProgramList.forEach(program => {
            program.relatedCollectionsList.forEach(collection => {
              if (collection.selected) {
                criteriaString += `${collection.criteria}, `;
              }
            });
          });
        // Remove the trailing comma and space
        criteriaString = criteriaString.replace(/, $/, '');
        this.queryUrlService.update( this.queryUrlService.COLLECTIONS, criteriaString );
    }


    /**
     * Loads the list of Collections to be used as selectable search TCIA-program in the 'Collections' TCIA-program panel in the Query section.
     */
    async loadNbiaProgramList() : Promise<void> {
        this.loadingDisplayService.setLoading(true, 'Loading Manufacturer query data...');
        return new Promise<void>( ( resolve, reject ) => {
            this.apiServerService.doGetNBIAProgram().pipe(
            takeUntil(this.ngUnsubscribe),
            catchError(err => {
                console.error('Error fetching manufacturer values:', err);
                this.loadingDisplayService.setLoading(false, 'Failed to load data');
                reject(err);
                return [];
            })
        ).subscribe(data => {
            if (data && data.length) {
                this.tciaProgramList = data.map(
                    (item, index) => {
                        const originalString = this.setOriginalString(item?.related_collections);
                        const mappedItem = {
                        //seq: index,
                        programName: item.program_name,
                        relatedCollections: originalString,
                        relatedCollectionsList: this.cleanCollectionsList(item?.related_collections ?? ''),
                        selected: false,
                        indeterminate: false,
                    };
                    // this.tciaProgramsDescriptionsService.setProgramCollections(item.program_name, originalString);
                    return mappedItem;
                }).sort((a, b) => (a.programName ?? '').localeCompare(b.programName ?? '', undefined, { sensitivity: 'base' }));
                // init time, run only once
                console.log('this.tciaProgramList one time - 1');
                this.initTciaProgramList();
                
            } else {
                console.warn('Received empty tciaProgram list from API.');
            }
            this.loadingDisplayService.setLoading(false, 'Done loading query data');
            resolve();
        });
        });
    }

    initTciaProgramList() {
        this.updateCriteriaList();
        this.initProgramListWithCounts(this.tciaProgramList, this.criteriaList);
        this.tciaProgramListHold = [...this.tciaProgramList];

        this.showAllCollections = new Array(this.tciaProgramList.length).fill(false);
        this.expandedPrograms = new Array(this.tciaProgramList.length).fill(false);
        this.completeTciaProgramList = this.tciaProgramList.map(item => ({
            ...item,
            count: item.relatedCollectionsList.length
        }));
        this.completeTciaProgramListHold = this.tciaProgramList.map(item => ({
            ...item,
            count: item.relatedCollectionsList.length
        }));
        if( !this.utilService.isNullOrUndefined( this.tciaProgramList ) ){
            this.uncheckedProgramCount = this.tciaProgramList.length;
        }else{
            this.uncheckedProgramCount = 0;
        }
    }

    private setOriginalString(value: any): string {
        if (typeof value !== 'string' || !value.trim()) {
            return 'No collections available'; // or ''
        }
        
        return value.trim();
    }

     /**
     * Sets up the list of TCIA-program and initializes it's check boxes.
     *
     * @param initCheckBox  Should all the check boxes be set to unchecked
     */
     updateTciaProgramList() {

        this.updateCriteriaList();

        this.updateTciaProgramListFromCriteriaList();
        
        //this.tciaProgramListHold = [...this.tciaProgramList];
    }

     /**
     * Sets up the list of criteria and initializes it's check boxes.
     *
     * @param initCheckBox  Should all the check boxes be set to unchecked
     */
     updateCriteriaList() {
        // If we are waiting on an update due to user (re)login
        if( this.utilService.isNullOrUndefined( this.completeCriteriaList ) ){
            return;
        }

        // If this is the first time this is running just copy the data to the criteriaList
        if( this.resetFlag ){
            this.criteriaList = this.completeCriteriaList.map( item => (
                {
                    ...item,
                    unfilteredCount: item.count
                }
            ));
            this.resetFlag = false;

        }else{
            // This will let us keep all of the criteria, but the ones that are not included in "data" will have a count of zero.
            this.criteriaList = this.utilService.copyCriteriaObjectArray( this.completeCriteriaListHold );

            this.criteriaList = this.criteriaList.map( item => (
                { ...item,
                    count: 0,
                    unfilteredCount: item.count
                }
            ));

            // Create a Map for quick lookup
            const criteriaMap = new Map(this.completeCriteriaList.map(item => [item.criteria, item.count]));

            // Update criteriaList using the Map
            this.criteriaList.forEach(item => {
                if (criteriaMap.has(item.criteria)) {
                    item.count = criteriaMap.get(item.criteria);
                }
            });         
        }
        this.criteriaListHold = this.utilService.copyCriteriaObjectArray( this.criteriaList );
    }

    private cleanCollectionsList(collections: string): any []{
        if (typeof collections !== 'string') {
            console.warn('Unexpected format for related_collections:', collections);
            return [];
            }
        // Split the string by commas and trim whitespace
        const collectionArray = collections.replace(' and ', ', ') .split(',')
        .map(item => ({
            collectionName: item.trim(),
            selected: false,
            count: 0,
        }));

        // Filter out any empty strings
        return collectionArray.filter(item => item.collectionName.trim() !== '');
    }

    /**
     * Updates, sort, etc... This category when the counts change.
     *
     * @param data
     * @returns {Promise<void>}  Don't need this.
     */
    async onCriteriaCountsChange( data ) {
        if( (this.utilService.isNullOrUndefined( data.res )) || (data.res.length < 1) ){
            return;
        }

        const collectionCriteriaObj = data.res.find(criteria => criteria.criteria === 'Collections')?.values;

        // Before we update the list, save the original list so we can restore checkboxes by criteria name.
       // const criteriaListTemp = [...this.criteriaList];

        // If there is no query just reset criteriaList to criteriaListHold.
        if( this.apiServerService.getSimpleSearchQueryHold() === null ){
            this.criteriaList = this.criteriaListHold;
            this.updateTciaProgramList();
        }else if( !this.utilService.isNullOrUndefined( collectionCriteriaObj ) ){
            while( this.utilService.isNullOrUndefined( this.completeCriteriaList ) ){
                await this.commonService.sleep( Consts.waitTime );
            }

            // CHECKME - this is a hasty fix, is there is a better way
            for( let criteria of this.completeCriteriaList ){
                criteria.count = 0;
            }
            this.completeCriteriaList.forEach( item => {
                if (collectionCriteriaObj.some(criteria => criteria.criteria === item.criteria)) {
                    item.count = collectionCriteriaObj.find(criteria => criteria.criteria === item.criteria).count;
                }
            });
        }
        //this.updateCriteriaList( false );
        this.updateTciaProgramList();

    }


    /**
     * Adds a 'seq' field to the criteriaList, it is the sequence which the criteria are displayed.<br>
     * This is used by the HTML when displaying only part of criteriaList.
     */
    // setSequenceValue() {
    //     let len = this.tciaProgramList.length;
    //     let seq = 0;
    //     for( let f = 0; f < len; f++ ){
    //         this.tciaProgramList[f].seq = seq;
    //         seq++;
    //     }
    // }

    updateTciaProgramListFromCriteriaList(): void {
        const collectionCountMap = new Map<string, { count:number, unfilteredCount :number}>();
        
        // Build a quick lookup map from criteriaList
        this.criteriaList.forEach(item => {
            // set with Normalized name for comparison
            collectionCountMap.set( item.criteria, {
                    count: Number(item.count)||0,
                    unfilteredCount: Number(item.unfilteredCount ?? item.count) || 0,
                });
        });
      
        this.tciaProgramList.forEach(program => {
            let totalCount = 0;
            let totalUnfilteredCount = 0;
            program.relatedCollectionsList = program.relatedCollectionsList.map(collection => {
                const collectionMatch = collectionCountMap.get(collection.criteria);
                const updatedCount = collectionMatch?.count ?? 0;
                totalCount += updatedCount;
               // totalUnfilteredCount += unfilteredCount;
                return {
                    ...collection,
                    count: updatedCount,
                   // unfilteredCount
                };
            });
            program.totalCount = totalCount;         
        });
        
      }

    initProgramListWithCounts(programList, collectionsWithCount): void {
        const collectionCountMap = new Map<string, { criteria: string, count:number, unfilteredCount :number}>();
        const programCollectionSet = new Set<string>;
        
        collectionsWithCount.forEach(item => {
            const normalizeName = this.utilService.normalizeName(item.criteria);
            // set with Normalized name for comparison
            collectionCountMap.set(normalizeName, 
                {   criteria: item.criteria,
                    count: item.count,
                    unfilteredCount: item.unfilteredCount || item.count,
                });
        });
      // init the tciaProgramList only include collectionNmae (no criteria)
        const filteredProgramList = programList.map(program => {
            let totalCount = 0;
            let totalUnfilteredCount = 0;
            const filteredCollections = program.relatedCollectionsList.map(collection => {
                const normalizeName = collection?.collectionName ? this.utilService.normalizeName(collection.collectionName) : '';
                const collectionNameMatch = collectionCountMap.get(normalizeName);
                if(collectionNameMatch){
                    programCollectionSet.add(normalizeName);
                }
                const count = Number(collectionNameMatch?.count) || 0;
                const unfilteredCount = Number(collectionNameMatch?.unfilteredCount) || count;
                totalCount += count;
                totalUnfilteredCount += unfilteredCount;
                return {
                    ...collection,
                    criteria: collectionNameMatch?.criteria,
                    count,
                    unfilteredCount
                };
            })
            .filter(collection => collection.unfilteredCount > 0); // Filter out collections with count 0

          return {  
            ...program,
            relatedCollectionsList: filteredCollections,
            totalCount,
            totalUnfilteredCount
          };
        })
        .filter(program => program.totalUnfilteredCount > 0); // Filter out programs with count 0

        const unmatched = collectionsWithCount.filter(col => {
            return !programCollectionSet.has(this.utilService.normalizeName(col?.criteria ? col.criteria : ''));
          });
        
        if (unmatched.length > 0) {
            const totalCount = unmatched.reduce((sum, c) => sum + (Number(c.count) || 0), 0);
            const totalUnfilteredCount = unmatched.reduce((sum, c) => sum + (Number(c.unfilteredCount) || (Number(c.count)||0)), 0);

            const unmatchedProgram = {
              programName: 'Unmatched Collections',
              relatedCollections: unmatched.map(c => c.criteria).join(', '),
              relatedCollectionsList: unmatched.map((c, i) => ({
                //seq: i,
                criteria: c.criteria,
                selected: false,
                count: c.count || 0,
                unfilteredCount: c.unfilteredCount || c.count || 0,
              })),
              totalCount,
              totalUnfilteredCount,
              selected: false,
              indeterminate: false,
              //seq: programList.length, // Or whatever you use for ordering
            };
            filteredProgramList.push(unmatchedProgram);
        }

       // Replace original list
        this.tciaProgramList =  filteredProgramList;
      
        // Now programList is enriched, can re-sort if needed
        // this.sortCollectionsInPrograms(programList); // Optional
      }

    onProgramCheckboxChange(index: number): void {
        const program = this.tciaProgramList[index];
        program.relatedCollectionsList.forEach(c => (c.selected = program.selected));
        program.indeterminate = false;
        this.sortTciaProgramListPrograms();
        this.onCheckboxClick();

    }
    
    onCollectionCheckboxChange(programIndex: number, collectionIndex: number): void {
        const program = this.tciaProgramList[programIndex];
        const programSelected = !!program.selected || !!program.indeterminate;
        const all = program.relatedCollectionsList.every(c => c.selected);
        const some = program.relatedCollectionsList.some(c => c.selected);
      
        program.selected = all;
        program.indeterminate = !all && some;
        this.sortTciaProgramListCollections(program);
        if(!programSelected || !some){
            this.sortTciaProgramListPrograms();
        }
        this.onCheckboxClick();
      }
    

    sortTciaProgramListPrograms(): void {
        this.tciaProgramList.sort((a, b) => {
            // First, selected programs on top
            // Priority: selected or indeterminate first, then unselected
            const aSelected = !!a.selected || !!a.indeterminate;
            const bSelected = !!b.selected || !!b.indeterminate;
            
            if (aSelected !== bSelected) {
                return aSelected ? -1 : 1;
            }
            if(!!this.sortNumChecked) {
                // Then sort by count
                // Then alphabetical
                return ((b.totalCount ?? 0) - (a.totalCount ?? 0) ) || (a.programName ?? '').localeCompare(b.programName ?? '', undefined, { sensitivity: 'base' });
            }else{
                return (a.programName ?? '').localeCompare(b.programName ?? '', undefined, { sensitivity: 'base' });   
            }
        });
    }

    sortTciaProgramListCollections(program: any): void {
        program.relatedCollectionsList.sort((a, b) => {
            if (a.selected !== b.selected) {
            return a.selected ? -1 : 1;
            }
            if(!!this.sortNumChecked) {
            // Then sort by count
            // Then alphabetical
            return ((b.count ?? 0) - (a.count ?? 0)) || (a.criteria ?? '').localeCompare(b.criteria ?? '', undefined, { sensitivity: 'base' });
            }else{
            return (a.criteria ?? '').localeCompare(b.criteria ?? '', undefined, { sensitivity: 'base' });
            }
        });
    }

    /**
     * Sorts the tcia program list based on the selected status of related collections and their criteria.
     * @param program
     */
    sortTciaProgramList(): void {
        this.tciaProgramList.forEach(program => {
        program.relatedCollectionsList.sort((a, b) => {
            if (a.selected !== b.selected) {
            return a.selected ? -1 : 1;
            }
            if(!!this.sortNumChecked) {
                // Then sort by count
                // Then alphabetical
                return ((b.count ?? 0) - (a.count ?? 0)) || (a.criteria ?? '').localeCompare(b.criteria ?? '', undefined, { sensitivity: 'base' });
              }else{
                return (a.criteria ?? '').localeCompare(b.criteria ?? '', undefined, { sensitivity: 'base' });
              }
        });
        });
    }      
      

    togglePanel(i: number, event: Event) {
        this.showAllCollections[i] = !this.showAllCollections[i];
        event.stopPropagation();
      }

    toggleShow(index: number): void {
        this.showAllCollections[index] = !this.showAllCollections[index];
      }

    toggleCollectionVisibility(index: number): void {
        this.showAllCollections[index] = !this.showAllCollections[index];
      }

    toggleProgramExpand(index: number): void {
        this.expandedPrograms[index] = !this.expandedPrograms[index];
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
    onCheckboxClick() {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );
        this.updateCheckboxCount();

        let criteriaForQuery: string[] = [];

        // This category's data for the query, the 0th element is always the category name.
        criteriaForQuery.push( Consts.COLLECTION_CRITERIA );
        const selectedCollections = this.getSelectedCollections();
        if (selectedCollections.length > 0) {
            criteriaForQuery.push(...selectedCollections.map(item => item.collection));
        }

        // Tells SearchResultsTableComponent that the query has changed,
        // SearchResultsTableComponent will (re)run the query &
        // send updated query to the Query display at the top of the Search results section.
        this.commonService.updateQuery( criteriaForQuery );

        // Update the query URL
        if( selectedCollections.length === 0 ){
            this.queryUrlService.clear( this.queryUrlService.COLLECTIONS );
        }else{
            this.sendSelectedCriteriaString();
        }
    }

    /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param show
     */
    onShowTciaProgramListClick( show: boolean ) {
        this.showTciaProgramList = show;
        this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_COLLECTIONS, this.showTciaProgramList );
    }

    /**
     * Clears the search text when the 'X' on the right side of the input is clicked.
     */
    onClearSearchInputClick() {
        this.searchHasFocus = true;
        this.searchInput = '';
        this.onSearchChange();
    }

    /**
     * When the search, within this criteria list changes, NOT the data search.
     */
    onSearchChange() {
        const selectedCollectionNames = new Set<string>();

        // Step 1: Capture current states from tciaProgramList
        const programStates = new Map<string, { selected: boolean, indeterminate: boolean, collectionMap: Map<string, boolean> ; }>();

        this.tciaProgramList.forEach(program => {
            const collectionMap = new Map<string, boolean>();
            program.relatedCollectionsList.forEach(col => {
                collectionMap.set(col.criteria, col.selected);
                if (col.selected) {
                selectedCollectionNames.add(col.criteria);
                }
            });

            programStates.set(program.programName, {
                selected: program.selected,
                indeterminate: program.indeterminate ?? false,
                collectionMap
            });
        });

        const searchInput = this.searchInput?.toUpperCase().trim() || '';
        this.tciaProgramList = this.tciaProgramListHold.map(program => {
            // Backup original list if not already backed up
            if (!program._originalCollectionsList) {
              program._originalCollectionsList = [...program.relatedCollectionsList];
            }
            const originalState = programStates.get(program.programName);
            // Filter based on criteria match
            const filteredCollectionsList = program._originalCollectionsList
            .filter(collection =>
                collection.criteria?.toUpperCase().includes(searchInput) || selectedCollectionNames.has(collection.criteria)
            ).map(collection => {
                const matching = program.relatedCollectionsList.find(c =>c.criteria === collection.criteria);
                return {
                ...collection,
                selected: originalState?.collectionMap.get(collection.criteria) ?? false,
                count: matching?.count ?? 0,
                }
            });
             if( filteredCollectionsList.length === 0 ){
                return null;
            }

            return {
                ...program,
                selected: originalState?.selected ?? false,
                indeterminate: originalState?.indeterminate ?? false,
                relatedCollectionsList: filteredCollectionsList,
            };
          }).filter((program): program is typeof this.tciaProgramList[number] => !!program);
    }

    /**
     * Toggles showing the search input box
     *
     * @note Clears the search text input when showSearch is switched to true
     */
    onSearchGlassClick() {
        this.showSearch = (!this.showSearch);
        if( !this.showSearch ){
            this.tciaProgramList = [...this.tciaProgramListHold];
            this.onClearSearchInputClick();
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
        let len = this.tciaProgramList.length;
        this.uncheckedProgramCount = 0;
        this.checkedProgramCount = 0;
        for( let f = 0; f < len; f++ ){
            if( this.tciaProgramList[f].selected || this.tciaProgramList[f].indeterminate ){
                this.checkedProgramCount++;
            }else{
                this.uncheckedProgramCount++;
            }
        }
    }


    /**
     * To reset everything to it's initial state after a new user has logged in.
     */
    resetAll() {
        this.updateTciaProgramList();
        this.onCollectionsClearAllClick( true ); // true will keep the updateQuery from being called.
    }

    resetTciaProgramListState(): void {
        this.tciaProgramList = this.completeTciaProgramListHold.map(program => {
          const originalList = program.relatedCollectionsList;
      
          const resetCollections = originalList.map((col, i) => ({
            ...col,
            selected: false,
          }));
          return {
            ...program,
            selected: false,
            indeterminate: false,
            relatedCollectionsList: resetCollections,
          };
        });
        this.uncheckedProgramCount = this.tciaProgramList.length;
        this.checkedProgramCount = 0;
      }


    /**
     *
     * @param {boolean} totalClear  true = the user has cleared the complete current query - no need to rerun the query
     */
    onCollectionsClearAllClick( totalClear: boolean ) {
        this.commonService.setHaveUserInput( true );
        // this.tciaProgramList.forEach(program => {
        //     program.selected = false;
        //     program.indeterminate = false;
        
        //     program.relatedCollectionsList.forEach(collection => {
        //       collection.selected = false;
        //     });
        //   });
        this.checkedProgramCount = 0;
        this.uncheckedProgramCount = this.tciaProgramList.length;
        this.apiServerService.refreshCriteriaCounts();

        if( !totalClear ){
            let criteriaForQuery: string[] = [];
            criteriaForQuery.push( Consts.COLLECTION_CRITERIA );

            // Tells SearchResultsTableComponent that the query has changed,
            // SearchResultsTableComponent will (re)run the query &
            // send updated query to the Query display at the top of the Search results section.
            this.commonService.updateQuery( criteriaForQuery );
        }

        // Clear the criteria search (The magnifying glass)
        this.showSearch = false;
        this.searchInput = '';
        //this.onSearchChange();


        this.queryUrlService.clear( this.queryUrlService.COLLECTIONS );

        // Restore original criteria list and counts.
        this.completeCriteriaList = [...this.completeCriteriaListHold];
        this.completeTciaProgramList = [...this.completeTciaProgramListHold]
        this.resetTciaProgramListState();
        //this.updateTciaProgramList();
    }


    onCollectionDescriptionClick( e , collectionName){
        // Set position
        this.toolTipY = e.view.pageYOffset + e.clientY;

        this.inCollection = true;

        // Populate
        this.toolTipHeading = collectionName;
        this.toolTipText = this.collectionDescriptionsService.getCollectionDescription( collectionName );
        if( (!this.utilService.isNullOrUndefinedOrEmpty( this.collectionDescriptionsService.getCollectionLicense( collectionName ) )) &&
            (!this.utilService.isNullOrUndefinedOrEmpty( this.collectionDescriptionsService.getCollectionLicense( collectionName ) )['longName']) &&
            (!Properties.NO_LICENSE)
        ){
            this.toolTipText += '<hr>License:<br>' + this.collectionDescriptionsService.getCollectionLicense( collectionName )['longName'];
        }
        this.showToolTip = true;
    }


    /**
     * Get the position and text for the Collection description tooltip/
     *
     * @param e  Mouse over event.
     * @param collectionName Collection name used to retrieve the description.
     */
    getPos( e, collectionName, n ) {
        // Set position
        this.toolTipY = e.view.pageYOffset + e.clientY;

        this.inCollection = true;

        // Populate
        this.toolTipHeading = collectionName;
        this.toolTipText = this.collectionDescriptionsService.getCollectionDescription( collectionName );
        if( (!this.utilService.isNullOrUndefinedOrEmpty( this.collectionDescriptionsService.getCollectionLicense( collectionName ) )) &&
            (!this.utilService.isNullOrUndefinedOrEmpty( this.collectionDescriptionsService.getCollectionLicense( collectionName ) )['longName']) &&
            (!Properties.NO_LICENSE)
        ){
            this.toolTipText += '<hr>License:<br>' + this.collectionDescriptionsService.getCollectionLicense( collectionName )['longName'];
        }

        setTimeout( () => {
            this.showToolTip = true;
        }, this.toolTipStartDelay );

    }

    /**
     * If the user has their mouse over the tool tip don't let it fade out.
     */
    mouseOverToolTip() {
        if( Properties.COLLECTION_DESCRIPTION_TOOLTIP_TYPE === 0){
            this.inCollection = true;
            this.toolTipStayOn = true;
        }

    }

    /**
     * If the user moved the mouse over the tool tip, fade out as soon as the mouse leaves.
     */
    mouseleaveToolTip() {
        this.inCollection = false;
        this.toolTipStayOn = false;
        this.hideToolTip();
    }

    async hideToolTip() {
        if( Properties.COLLECTION_DESCRIPTION_TOOLTIP_TYPE === 1){
            return;
        }

        this.inCollection = false;
        this.toolTipCounter++;
        let count = Properties.COLLECTION_DESCRIPTION_TOOLTIP_TIME;

        while( count > 0 ){
            await this.commonService.sleep( this.descriptionTooltipDelay );
            count--;
        }
        this.toolTipCounter--;
        if( count <= 0 && this.toolTipCounter <= 0 && (!this.toolTipStayOn) && (!this.inCollection) ){
            this.showToolTip = false;
        }
    }

    onSetSort( sortCriteria ) {
        // (Re)sort the list because a checked criteria is higher than unchecked.
        this.sortNumChecked = sortCriteria === 0;
        this.persistenceService.put( this.persistenceService.Field.COLLECTIONS_SORT_BY_COUNT, this.sortNumChecked );
        //this.criteriaList = this.sortService.criteriaSort( this.criteriaList, this.cBox, this.sortNumChecked ); // sortNumChecked is a bool
        //this.setSequenceValue();
        this.sortTciaProgramListPrograms();
        this.sortTciaProgramList();

    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
