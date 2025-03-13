import { EventEmitter, Injectable } from '@angular/core';
import { Consts } from '@app/consts';
import { UtilService } from '@app/common/services/util.service';
import { PersistenceService } from '@app/common/services/persistence.service';


@Injectable({
  providedIn: 'root'
})
export class CommonService{
    /**
     * Used by SearchResultsPagerComponent to know how many pages to use for the Pager.<br>
     * Used by SearchResultsComponent to update the top "Search results Showing X - X+ResultsPerPage"<br>
     * Used by  SummaryComponent to display search results count above charts.
     * @type {EventEmitter}
     */
    searchResultsCountEmitter = new EventEmitter();
    searchResultsCount = -1;

    simpleSearchResultsCountEmitter = new EventEmitter();
    simpleSearchResultsCount = -1;


    /**
     * Used by CartComponent to know how many pages to use for the Pager.<br>
     * Used by SearchResultsPagerComponent to know how big, and how many pages
     * @type {EventEmitter}
     */
    cartCountEmitter = new EventEmitter();

    /**
     * Used by SearchResultsComponent to update the top "Search results Showing X - X+ResultsPerPage"<br>
     * Used by SearchResultsTableComponent to know how many rows to display.<br>
     * Used by SearchResultsPagerComponent to know how many pages to use for the Pager.
     * @type {EventEmitter}
     */
    searchResultsPerPageEmitter = new EventEmitter();
    resultsPerPage = 0;

    /**
     *  Used by updateCartsPerPage to emit the number of rows to display when it is changed.
     *  Used by CartComponent to know how many rows to display.<br>
     *  Used by SearchResultsPagerComponent to kno w how many pages to break the cart list into.
     * @type {EventEmitter}
     */
    cartsPerPageEmitter = new EventEmitter();

    /**
     * Subscribed to by CartComponent to get the current page of the cart list display.
     * @type {EventEmitter}
     */
    cartPageEmitter = new EventEmitter();

    /**
     * Used by SearchResultsComponent to update the top "Search results Showing X - X+ResultsPerPage"<br>
     * Used by SearchResultsTableComponent to know which rows to display.
     * @type {EventEmitter}
     */
    searchResultsPageEmitter = new EventEmitter();

    /**
     * Used by SearchResultsComponent, to change the Search results footer css.<br>
     * Used by SearchResultsTableComponent, to change the Search results table css.
     * @type {EventEmitter}
     */
    searchResultsToggleScrollEmitter = new EventEmitter();

    /**
     * Used by SearchResultsCartSelectorComponent to know when the the select all check  to the right of the word "Cart" in the table header is clicked.
     * @type {EventEmitter}
     */
    searchResultsCartCheckEmitter = new EventEmitter();
    searchResultsCartCheckSubsetEmitter = new EventEmitter();

    /**
     * This will be used by Query Builder, when I get it working.
     * @type {EventEmitter<any>}
     */
    clearAllQueryBuilderEmitter = new EventEmitter();

    /**
     * Called by emitSimpleSearchQueryForDisplay when the query changes.<br>
     *
     * Used by DisplayQuerySimpleSearchComponent to update the "Display query" at the top of the data section.
     * @type {EventEmitter}
     */
    updateSimpleSearchQueryForDisplayEmitter = new EventEmitter();
    currentSimpleSearchQuery = [];

    /**
     * Called by emitQueryBuilderQueryForDisplay when the query changes.<br>
     *
     * Used by DisplayQueryQueryBuilderComponent to update the "Display query" at the top of the data section.
     * @type {EventEmitter}
     */
    updateQueryBuilderForDisplayEmitter = new EventEmitter();

    /**
     * Called by emitTextSearchQueryForDisplay when the query changes.<br>
     *
     * Used by DisplayQueryTextSearchComponent to update the "Display query" at the top of the data section.
     * @type {EventEmitter}
     */
    updateTextSearchQueryForDisplayEmitter = new EventEmitter();
    currentTextSearchQuery = '';
    showTextExplanationEmitter = new EventEmitter();
    showTextExplanation = false;

    showThirdPartyExplanationEmitter = new EventEmitter();
    showThirdPartyExplanation = false;

    showClinicalTimePointsExplanationEmitter = new EventEmitter();
    showClinicalTimePointsExplanation = false;

    showPatientAgeRangeExplanationEmitter = new EventEmitter();
    showPatientAgeRangeExplanation = false;

    showSliceThicknessRangeExplanationEmitter = new EventEmitter();
    showSliceThicknessRangeExplanation = false;

    showPixelSpacingRangeExplanationEmitter = new EventEmitter();
    showPixelSpacingRangeExplanation = false;

    showImageDescriptionExplanationEmitter = new EventEmitter();
    showImageDescriptionExplanation = false;

    showMinimumMatchedStudiesExplanationEmitter = new EventEmitter();
    showMinimumMatchedStudiesExplanation = false;

    showSubjectIdExplanationEmitter = new EventEmitter();
    showSubjectIdExplanation = false;

    showPhantomQueryExplanationEmitter = new EventEmitter();
    showPhantomQueryExplanation = false;

    /**
     * Called when something in the query section changes<br>
     *
     * Used by SearchResultsTableComponent when a new query is emitted, to do a new search.
     * @type {EventEmitter}
     */
    updateQueryEmitter = new EventEmitter();

    // TODO explain this, and give it a better name
    runSearchForUrlParametersEmitter = new EventEmitter();
    // TODO explain this
    rerunQueryEmitter = new EventEmitter();

    /**
     * Called by selectDataTab to change the search results tab without the user clicking it.<br>
     *
     * Used by DataSectionTabsComponent.
     * @type {EventEmitter}
     */
    selectDataTabEmitter = new EventEmitter();

    /**
     * Called by sendSubjectDetailsRows, when a "Subject ID" in the search results is clicked.<br>
     *
     * Subscribed to by SubjectDetailsComponent, which will do a "DrillDown" query
     * @type {EventEmitter}
     */
    displaySubjectDetailsEmitter = new EventEmitter();

    /**
     * Called when the "Search results columns Checkbox popup" button is clicked.<br>
     *
     * Subscribed to by SearchResultsColumnSelector
     * @type {EventEmitter}
     */
    showSearchResultsColumnEmitter = new EventEmitter();

    /**
     * Emitted by SearchResultsColumnSelectorComponent when a change is made in the Search results columns Checkbox popup.<br>
     *
     * Subscribed to by SearchResultsTableComponent, so it knows which columns to hide or show.
     * @type {EventEmitter}
     */
    searchResultsColumnListEmitter = new EventEmitter();

    seriesCartChangeEmitter = new EventEmitter();

    // CHECKME  TODO explain
    subjectCartChangeEmitter = new EventEmitter();

    checkSeriesByStudyEmitter = new EventEmitter();


    // TODO explain
    showSeriesEmitter = new EventEmitter();

    /**
     * Is the popup with the checkboxes for the usr to search results columns visible.
     * @type {boolean}
     */
    showSearchResultsColumnState = false;

    /**
     * Used to keep track of whether clicking the check next to "Cart" in the table heading should turn them all on or all off.
     * @type {boolean}
     */
    cartCheckToggle = false;

    /**
     * Keeps track of the current scrolling style.
     * @type {boolean}
     */
    scrollFlag = false;

    // TODO explain
    reInitChartEmitter = new EventEmitter();
    updateChartEmitter = new EventEmitter();
    cartListDownLoadEmitter = new EventEmitter();
    downloaderDownLoadEmitter = new EventEmitter();
    downloadCartAsCsvEmitter = new EventEmitter();
    sharedListSavePopupEmitter = new EventEmitter();
    saveMyCartPopupEmitter = new EventEmitter();
    sharedListSaveFromCartEmitter = new EventEmitter();
    sharedListSaveFromSubjectIdEmitter = new EventEmitter();


    resetAllSimpleSearchEmitter = new EventEmitter();
    resetAllSimpleSearchForLoginEmitter = new EventEmitter();
    resetAllTextSearchEmitter = new EventEmitter();

    // TODO explain
    criteriaQueryShow = {};

    // TODO explain
    textSearchQueryEmitter = new EventEmitter();

    // TODO explain
    queryBuilderAnyOrAllEmitter = new EventEmitter();
    queryBuilderAnyOrAll = 1;  // Any

    textSearchResults = '';
    simpleSearchResults = '';
    criteriaSearchResults = '';


    minimumMatchedStudiesValue;

    /**
     * Tells search results - Text search, or Criteria search.
     * Some display columns are on for one, or the other type of search.
     * Which column belongs to which search type is defined in searchResultsColumnNames.json
     */
    resultsDisplayMode;
    resultsDisplayModeEmitter = new EventEmitter();

    showDataSectionEmitter = new EventEmitter();

    showQuerySectionEmitter = new EventEmitter();

    missingCriteriaArray = [];
    missingCriteriaEmitter = new EventEmitter();

    // TODO explain
    closeSubjectDetailsEmitter = new EventEmitter();

    // TODO explain
    showQueryUrlEmitter = new EventEmitter();

    // TODO explain
    isSearchable = false;

    updateCollectionDescriptionsEmitter = new EventEmitter();
    showIntroEmitter = new EventEmitter();

    // Used when there is a query from URL parameters, so we didn't want to run the search until all query criteria where set,
    // but then a user has added query criteria after the URL parameter search. this flag tells us (if true) don't wait, run the search.
    haveUserInput = false;

    // FIXME this is a quick fix that needs to be revisited. this will hold the "Summary" or "Search Results" tab, so it can be restored when coming back from Text Search;
    simpleSearchDataTab = 1;

    downloadManifestQuery = '';
    downloadTextSearchManifestQuery = '';
    offsetHeight;
    offsetHeightEmitter = new EventEmitter();

    constructor( private persistenceService: PersistenceService, private utilService: UtilService ) {
        this.initCriteriaQueryShow();
    }

    setOffsetHeight( h ) {
        this.offsetHeight = h;
        this.offsetHeightEmitter.emit( h );
    }

    getOffsetHeight() {
        return this.offsetHeight;
    }

    showIntro() {
        this.showIntroEmitter.emit();
    }

    getIsSearchable() {
        return this.isSearchable;
    }

    setIsSearchable( is ) {
        this.isSearchable = is;  // CHECKME Do we even need/use this?
    }

    clearMissingCriteriaArray() {
        this.missingCriteriaArray = [];
        this.missingCriteriaEmitter.emit( this.missingCriteriaArray );
    }

    updateMissingCriteriaArray( missingCriteria ) {
        for( let missingPart of missingCriteria ){
            this.missingCriteriaArray.push( missingPart );
        }
        this.missingCriteriaEmitter.emit( this.missingCriteriaArray );
    }

    showDataSection() {
        this.showDataSectionEmitter.emit( true );
    }

    hideDataSection() {
        this.showDataSectionEmitter.emit( false );
    }

    // Used when there is a query from URL parameters, so we didn't want to run the search until all query criteria where set,
    // but then a user has added query criteria after the URL parameter search. this flag tells us (if true) don't wait, run the search.
    setHaveUserInput( i ) {
        this.haveUserInput = i;
    }

    getHaveUserInput() {
        return this.haveUserInput;
    }


    // FIXME rename this, it's not a toggle anymore.
    showQueryUrlToggle() {
        this.showQueryUrlEmitter.emit();
    }

    showQuerySection( show ) {
        this.showQuerySectionEmitter.emit( show );
    }

    closeSubjectDetails( index ) {
        this.closeSubjectDetailsEmitter.emit( index );
    }

    updateCollectionDescriptions() {
        this.updateCollectionDescriptionsEmitter.emit();
    }

    /**
     * AKA "At least X studies"
     * @param value
     */
    setMinimumMatchedStudiesValue( value ) {
        this.minimumMatchedStudiesValue = value;
    }

    getMinimumMatchedStudiesValue() {
        return this.minimumMatchedStudiesValue;
    }

    getMinimumMatchedStudiesStaus(){
        // check the value in minimumMatchedStudiesStaus
        // return true if the value not default value (1-UIDs)
        return this.minimumMatchedStudiesValue !== ('1' + Consts.MIMUMUM_MATCHED_STUDIES_TYPE_DEFAULT)
    }

    setQueryBuilderAnyOrAll( value ) {
        this.queryBuilderAnyOrAll = value;
        this.queryBuilderAnyOrAllEmitter.emit( value );
    }

    getQueryBuilderAnyOrAll() {
        return this.queryBuilderAnyOrAll;
    }

    /**
     * For reloading the search criteria after a different user has logged in, every user can have different criteria available/accessible.
     */
    resetAllSimpleSearchForLogin() {
        this.resetAllSimpleSearchForLoginEmitter.emit();
    }

    /**
     * For clearing all queries, search results, and resetting available Collections, Image Modality, etc, for initialization, and clear ,
     */
    resetAllSimpleSearch() {
        this.resetAllSimpleSearchEmitter.emit();
    }


    /**
     * Used to persist users choices of which search criteria are collapsed, and which are shown
     * @param name
     * @param value
     */
    setCriteriaQueryShow( name, value ) {
        this.criteriaQueryShow[name] = value;
        this.persistenceService.put( this.persistenceService.Field.CRITERIA_QUERY_SHOW, JSON.stringify( this.criteriaQueryShow ) );
    }

    getCriteriaQueryShow( name ) {
        return this.criteriaQueryShow[name];
    }

    /**
     * We don't need to set defaults here, the will be set individually in each criteria's component.
     *
     * The Defaults are in Consts, currently they are
     * <ul>
     *  <li>SHOW_CRITERIA_QUERY_COLLECTIONS_DEFAULT: true</li>
     *  <li>SHOW_CRITERIA_QUERY_ANATOMICAL_SITE_DEFAULT: true</li>
     *  <li>SHOW_CRITERIA_QUERY_IMAGE_MODALITY_DEFAULT: true</li>
     *  <li>SHOW_CRITERIA_QUERY_MANUFACTURER_MODEL_DEFAULT: false</li>
     *  <li>SHOW_CRITERIA_QUERY_AVAILABLE_DEFAULT: false</li>
     *  <li>SHOW_CRITERIA_QUERY_SUBJECT_ID_DEFAULT: false</li>
     * </ul>
     */
    initCriteriaQueryShow() {
        try{
            // The Show or Collapsed state of each of the criteria query sections on the left.
            this.criteriaQueryShow = JSON.parse( this.persistenceService.get( this.persistenceService.Field.CRITERIA_QUERY_SHOW ) );
        }catch( e ){
        }
    }


    setSimpleSearchDataTab( tab: number ) {
        this.simpleSearchDataTab = tab;
    }

    getSimpleSearchDataTab() {
        return this.simpleSearchDataTab;
    }

    getResultsDisplayMode() {
        return this.resultsDisplayMode;
    }

    setResultsDisplayMode( mode ) {
        this.resultsDisplayMode = mode;
        this.resultsDisplayModeEmitter.emit( mode );
    }

    // CHECKME  still just a test
    reInitCharts() {
        this.reInitChartEmitter.emit();
    }

    updateAllCharts() {
        this.updateChartEmitter.emit();
    }

    sleep( ms ) {
        return new Promise( resolve => setTimeout( resolve, ms ) );
    }

    clearTextSearchResults() {
        this.textSearchResults = '';
        this.updateSearchResultsCount( -1 );
    }

    setTextSearchResults( searchResults ) {
        this.textSearchResults = searchResults;
    }

    getTextSearchResults() {
        return this.textSearchResults;
    }

    setShowTextExplanation( e ) {
        this.showTextExplanation = e;
        this.showTextExplanationEmitter.emit( this.showTextExplanation );
    }

    setShowClinicalTimePointsExplanation( e ) {
        this.showClinicalTimePointsExplanation = e;
        this.showClinicalTimePointsExplanationEmitter.emit( this.showClinicalTimePointsExplanation );
    }

    setShowThirdPartyExplanation( e ) {
        this.showThirdPartyExplanation = e;
        this.showThirdPartyExplanationEmitter.emit( this.showThirdPartyExplanation );
    }

    setShowPatientAgeRangeExplanation( e ) {
        this.showPatientAgeRangeExplanation = e;
        this.showPatientAgeRangeExplanationEmitter.emit( this.showPatientAgeRangeExplanation );
    }

    setShowSliceThicknessRangeExplanation( e ) {
        this.showSliceThicknessRangeExplanation = e;
        this.showSliceThicknessRangeExplanationEmitter.emit( this.showSliceThicknessRangeExplanation );
    }

    setShowPixelSpacingRangeExplanation( e ) { 
        this.showPixelSpacingRangeExplanation = e;
        this.showPixelSpacingRangeExplanationEmitter.emit( this.showPixelSpacingRangeExplanation );
    }

    setShowImageDescriptionExplanation( e ) {
        this.showImageDescriptionExplanation = e;
        this.showImageDescriptionExplanationEmitter.emit( this.showImageDescriptionExplanation );
    }

    setShowMinimumMatchedStudiesExplanation( e ) {
        this.showMinimumMatchedStudiesExplanation = e;
        this.showMinimumMatchedStudiesExplanationEmitter.emit( this.showMinimumMatchedStudiesExplanation );
    }

    setShowSubjectIdExplanation( e ) {
        this.showSubjectIdExplanation = e;
        this.showSubjectIdExplanationEmitter.emit( this.showSubjectIdExplanation );
    }

    setShowPhantomQueryExplanation( e ) {
        this.showPhantomQueryExplanation = e;
        this.showPhantomQueryExplanationEmitter.emit( this.showPhantomQueryExplanation );
    }


    clearSimpleSearchResults() {
        this.simpleSearchResults = '';
        this.updateSearchResultsCount( -1 );
    }

    setSimpleSearchResults( str ) {
        this.simpleSearchResults = str;
    }

    getSimpleSearchResults() {
        return this.simpleSearchResults;
    }

    setCriteriaSearchResults( str ) {
        this.criteriaSearchResults = str;
    }

    getCriteriaSearchResults() {
        return this.criteriaSearchResults;
    }


    // TODO explain
    showSeries( i, state ) {
        this.showSeriesEmitter.emit( { i, state } );
    }

    // TODO explain
    updateSeriesCartStatus( subjectId, seriesId, state ) {
        // The seriesId will only be used by the studyCartSelector  TODO clarify
        this.seriesCartChangeEmitter.emit( { subjectId, seriesId, state } );
    }

    // TODO Explain
    updateSubjectCartStatus( subjectId, state ) {
        this.subjectCartChangeEmitter.emit( { subjectId: subjectId, state: state } );
    }


    /**
     * Called by SearchResultsTableComponent, when a "Subject ID" in the search results is clicked.<br>
     *
     * Subscribed to by SubjectDetailsComponent, which will do a "DrillDown" query
     * @param rowData
     */
    sendSubjectDetailsRows( rowData ) {
        this.displaySubjectDetailsEmitter.emit( rowData );
    }


    /**
     * Called by TopRightButtonGroupComponent, toggles the style of scrolling.<br>
     *
     * Subscribed to by SearchResultsComponent, to change the Search results footer css.<br>
     * Subscribed to by SearchResultsTableComponent, to change the Search results table css.
     * @see search-results-table-div-scroll in search-results-table.component.css
     */
    toggleSearchResultsScrolling() {
        this.scrollFlag = !this.scrollFlag;
        this.searchResultsToggleScrollEmitter.emit( this.scrollFlag );
    }

    clearCart() {
        this.cartCheckToggle = false;
        this.searchResultsCartCheckEmitter.emit( this.cartCheckToggle );
    }

    /**
     * Called when the select/unselect all check, to the right of the word "Cart" in the table header is clicked.
     *
     * @FIXME move this to the cart service
     */
    toggleCartCheck() {
        this.cartCheckToggle = (!this.cartCheckToggle);
        this.searchResultsCartCheckEmitter.emit( this.cartCheckToggle );
    }


    /**
     * Called when the "select These", to the right of the word "Cart" in the table header is clicked.
     *
     * @FIXME move this to the cart service
     */
    toggleCartSubset( subjects, state ) {
        this.searchResultsCartCheckSubsetEmitter.emit( { subjects, state } );
    }


    getCartCheck() {
        return this.cartCheckToggle;
    }


    setSeriesCheckByStudy( studyId, state ) {
        this.checkSeriesByStudyEmitter.emit( { studyId, state } );
    }

    /**
     * Called by SearchResultsColumnSelectorComponent when a change is made in the Search results columns Checkbox popup,
     * the updated list will be emitted here.
     *
     * @param columns  Updated columns list
     */
    updateSearchResultsColumnList( columns ) {
        this.searchResultsColumnListEmitter.emit( columns );
    }


    /**
     * This is called when something in the query section changes<br>
     *
     * Subscribed to by SearchResultsTableComponent, which will rerun the search.
     * @param parameters
     */
    updateQuery( parameters: string[] ) {
        // Reset page to beginning on a new search.
        // -1 tells pagers to go to page zero and tells search by page not to call search service for this page change.
        this.updateCurrentSearchResultsPage( -1 );
        this.updateQueryEmitter.emit( parameters ); // For SearchResultsTableComponent
    }

    // @CHECKME - this is not ready yet
    reRunSearch() {
        this.rerunQueryEmitter.emit();
    }

    runSearchForUrlParameters() {
        this.runSearchForUrlParametersEmitter.emit();
    }

    /**
     * Used by Query Display at top.
     *
     * @param queryText
     */
    emitTextSearchQueryForDisplay( queryText ) {
        this.currentTextSearchQuery = queryText;
        this.updateTextSearchQueryForDisplayEmitter.emit( queryText );
    }

    getCurrentTextSearchQuery() {
        return this.currentTextSearchQuery;
    }

    clearTextSearchUserInput() {
        this.resetAllTextSearchEmitter.emit();
    }

    setDownloadManifestQuery(dlmq){
        this.downloadManifestQuery = dlmq;
    }

    getDownloadManifestQuery(){
        return this.downloadManifestQuery;
    }

    setTextSearchDownloadManifestQuery(dltmq){
        this.downloadTextSearchManifestQuery = dltmq;
    }

    getTextSearchDownloadManifestQuery(){
        return this.downloadTextSearchManifestQuery;
    }

    /**
     * Sends to the query display at the top of the Search results section, an array of the query elements in a format that displayQuery expects.
     * @param allData  an array of selected criteria
     */
    emitSimpleSearchQueryForDisplay( allData ) {
        let maxCriteriaLen = 25; // @FIXME make this a constant
        let displayQuery = [];


        // Collections
        if( !this.utilService.isNullOrUndefined( allData[Consts.COLLECTION_CRITERIA] ) ){
            for( let item of allData[Consts.COLLECTION_CRITERIA] ){
                displayQuery.push( { [Consts.CRITERIA]: 'collections', 'name': item } );
            }
        }

        // Exclude Commercial
        if( (!this.utilService.isNullOrUndefined( allData[Consts.EXCLUDE_COMMERCIAL_CRITERIA] )) &&
            (!this.utilService.isNullOrUndefined( allData[Consts.EXCLUDE_COMMERCIAL_CRITERIA][0] ))
        ){
            displayQuery.push( {
                [Consts.CRITERIA]: 'excludeCommercial', 'name': allData[Consts.EXCLUDE_COMMERCIAL_CRITERIA][0]
            } );
        }

        // Days from Baseline // TODO deal with missing values (to or from)
        if( (!this.utilService.isNullOrUndefined( allData[Consts.DAYS_FROM_BASELINE_CRITERIA] )) &&
            (!this.utilService.isNullOrUndefined( allData[Consts.DAYS_FROM_BASELINE_CRITERIA][0] ))
        ){
            // No From
            if( allData[Consts.DAYS_FROM_BASELINE_CRITERIA][1].length < 1){
                displayQuery.push( {
                    [Consts.CRITERIA]: 'daysFrom', 'name': allData[Consts.DAYS_FROM_BASELINE_CRITERIA][0] + ' to ' + allData[Consts.DAYS_FROM_BASELINE_CRITERIA][2]
                } );
            }

            // No To
            else if( allData[Consts.DAYS_FROM_BASELINE_CRITERIA][2].length < 1){
                displayQuery.push( {
                    [Consts.CRITERIA]: 'daysFrom', 'name': allData[Consts.DAYS_FROM_BASELINE_CRITERIA][0] + ' from ' + allData[Consts.DAYS_FROM_BASELINE_CRITERIA][1]
                } );
            }
            else{
                displayQuery.push( {
                    [Consts.CRITERIA]: 'daysFrom', 'name': allData[Consts.DAYS_FROM_BASELINE_CRITERIA][0] + ' ' +
                        allData[Consts.DAYS_FROM_BASELINE_CRITERIA][1] + ' to ' + allData[Consts.DAYS_FROM_BASELINE_CRITERIA][2]
                } );
            }
        }
        // Species
        if( !this.utilService.isNullOrUndefined( allData[Consts.SPECIES_CRITERIA] ) ){
            for( let item of allData[Consts.SPECIES_CRITERIA] ){
                displayQuery.push( { [Consts.CRITERIA]: 'species', 'name': item } );
            }
        }

        // Phantoms
        if( !this.utilService.isNullOrUndefined( allData[Consts.PHANTOMS_CRITERIA] ) ){
            for( let item of allData[Consts.PHANTOMS_CRITERIA] ){
                displayQuery.push( { [Consts.CRITERIA]: 'phantom', 'name': (item === '2') ? 'Only' : 'Exclude' } );
            }
        }

        // Third Party
        if( !this.utilService.isNullOrUndefined( allData[Consts.THIRD_PARTY_CRITERIA] ) ){
            for( let item of allData[Consts.THIRD_PARTY_CRITERIA] ){
                displayQuery.push( {
                    [Consts.CRITERIA]: 'AnalysisResults',
                    'name': (item.toUpperCase() === 'YES') ? 'Only' : 'Exclude'
                } );
            }
        }

        // Image Modality
        if( !this.utilService.isNullOrUndefined( allData['ImageModalityCriteria'] ) ){
            for( let item of allData['ImageModalityCriteria'] ){
                displayQuery.push( { [Consts.CRITERIA]: 'imageModality', 'name': item } );
            }
        }

        // Anatomical Site
        if( !this.utilService.isNullOrUndefined( allData[Consts.ANATOMICAL_SITE_CRITERIA] ) ){
            for( let item of allData[Consts.ANATOMICAL_SITE_CRITERIA] ){
                displayQuery.push( { [Consts.CRITERIA]: 'BodyPartExamined', 'name': item } );
            }
        }

        // Subject ID  (Patient)
        if( !this.utilService.isNullOrUndefined( allData[Consts.PATIENT_CRITERIA] ) ){
            for( let item of allData[Consts.PATIENT_CRITERIA] ){
                if( item.length > maxCriteriaLen ){
                    item = item.substring( 0, maxCriteriaLen ) + '...';
                }
                // displayQuery.push( { [Consts.CRITERIA]: 'subjectId', 'name': item } );
                // rc9.4 change Subject ID to Identifiers
                displayQuery.push( { [Consts.CRITERIA]: 'Patient Identifiers', 'name': item } );
            }
        }

        // Subject ID  (Series ID)
        if( !this.utilService.isNullOrUndefined( allData[Consts.SERIES_CRITERIA] ) ){
            for( let item of allData[Consts.SERIES_CRITERIA] ){
                if( item.length > maxCriteriaLen ){
                    item = item.substring( 0, maxCriteriaLen ) + '...';
                }
                // displayQuery.push( { [Consts.CRITERIA]: 'subjectId', 'name': item } );
                // rc9.4 change Subject ID to Identifiers
                displayQuery.push( { [Consts.CRITERIA]: 'Series Identifiers', 'name': item } );
            }
        }

        //Subject ID (Study ID)
        if( !this.utilService.isNullOrUndefined( allData[Consts.STUDY_CRITERIA] ) ){
            for( let item of allData[Consts.STUDY_CRITERIA] ){
                if( item.length > maxCriteriaLen ){
                    item = item.substring( 0, maxCriteriaLen ) + '...';
                }
                // displayQuery.push( { [Consts.CRITERIA]: 'subjectId', 'name': item } );
                // rc9.4 change Subject ID to Identifiers
                displayQuery.push( { [Consts.CRITERIA]: 'Study Identifiers', 'name': item } );
            }
        }


        // Manufacturer
        if( !this.utilService.isNullOrUndefined( allData[Consts.MANUFACTURER_CRITERIA] ) ){
            for( let item of allData[Consts.MANUFACTURER_CRITERIA] ){
                // displayQuery.push( { [Consts.CRITERIA]: 'manufacturer', 'name': item } );
                displayQuery.push( { [Consts.CRITERIA]: 'manufacturer', 'name': item } );
            }
        }

        // Manufacturer Model
        if( !this.utilService.isNullOrUndefined( allData[Consts.MANUFACTURER_MODEL_CRITERIA] ) ){
            for( let item of allData[Consts.MANUFACTURER_MODEL_CRITERIA] ){
                displayQuery.push( { [Consts.CRITERIA]: 'manufacturerModel', 'name': item } );
            }
        }

        // Manufacturer Software version
        if( !this.utilService.isNullOrUndefined( allData[Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA] ) ){
            for( let item of allData[Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA] ){
                // displayQuery.push( { [Consts.CRITERIA]: 'Software ver.', 'name': item } );
                displayQuery.push( { [Consts.CRITERIA]: 'manufacturerModel', 'name': item } );
            }
        }


        // DATE_RANGE_CRITERIA
        if( !this.utilService.isNullOrUndefined( allData[Consts.DATE_RANGE_CRITERIA] ) ){
            for( let item of allData[Consts.DATE_RANGE_CRITERIA] ){
                displayQuery.push( { [Consts.CRITERIA]: 'dateRange', 'name':  item  } );
            }
        }

         // Patient Age Range
         if( !this.utilService.isNullOrUndefined( allData[Consts.PATIENT_AGE_RANGE_CRITERIA] ) ){
            for( let item of allData[Consts.PATIENT_AGE_RANGE_CRITERIA] ){
                displayQuery.push( { [Consts.CRITERIA]: 'patientAgeRange', 'name': item } );          
            }
            // displayQuery.push( { [Consts.CRITERIA]: 'patientAgeRange', 'name': allData[Consts.PATIENT_AGE_RANGE_CRITERIA][0] + ' ' +
            //     allData[Consts.PATIENT_AGE_RANGE_CRITERIA][1] + ' to ' + allData[Consts.PATIENT_AGE_RANGE_CRITERIA][2] + ' (years old)' } );
            
        }

         // Patient sex
         if( !this.utilService.isNullOrUndefined( allData[Consts.PATIENT_SEX_CRITERIA] ) ){
            for( let item of allData[Consts.PATIENT_SEX_CRITERIA] ){
                displayQuery.push( { [Consts.CRITERIA]: 'patientSex', 'name': item } );
            }
        }

         // Slice Thickness Range
        if( !this.utilService.isNullOrUndefined( allData[Consts.SLICE_THICKNESS_RANGE_CRITERIA] ) ){
            for( let item of allData[Consts.SLICE_THICKNESS_RANGE_CRITERIA] ){
                displayQuery.push( { [Consts.CRITERIA]: 'sliceThicknessRange', 'name': item } );          
            }
        }

        // Pixel Spacing Range
        if( !this.utilService.isNullOrUndefined( allData[Consts.PIXEL_SPACING_RANGE_CRITERIA] ) ){ 
            for( let item of allData[Consts.PIXEL_SPACING_RANGE_CRITERIA] ){
                displayQuery.push( { [Consts.CRITERIA]: 'pixelSpacingRange', 'name': item } );          
            } 
        }

        // Image Description
        if( !this.utilService.isNullOrUndefined( allData[Consts.IMAGE_DESCRIPTION_CRITERIA] ) ){
            for( let item of allData[Consts.IMAGE_DESCRIPTION_CRITERIA] ){
                displayQuery.push( { [Consts.CRITERIA]: 'imageDescription', 'name': item } );
            }
        }

        this.currentSimpleSearchQuery = displayQuery;
        this.updateSimpleSearchQueryForDisplayEmitter.emit( displayQuery );
    }

    getCurrentSimpleSearchQuery() {
        return this.currentSimpleSearchQuery
    }

    emitQueryBuilderQueryForDisplay( queryData ) {
        this.updateQueryBuilderForDisplayEmitter.emit( queryData );
    }

    clearAllQueryBuilder() {
        this.clearAllQueryBuilderEmitter.emit();
    }

    /**
     * Called by SearchResultsTableComponent<br><br>
     *
     * Subscribed to by SearchResultsPagerComponent to know how many pages to use for the Pager.<br>
     * Subscribed to by SearchResultsComponent to update the top "Search results Showing X - X+ResultsPerPage"<br>
     * Subscribed to by SummaryComponent to display search results count above charts.<br>
     *
     * @param count  Set to -1 to clear search results
     */
    updateSearchResultsCount( count: number ) {
        if( this.searchResultsCount !== count ){
            this.searchResultsCount = count;
            this.searchResultsCountEmitter.emit( count );
        }
    }

    getSearchResultsCount() {
        return this.searchResultsCount;
    }


    /**
     * @TODO Explain why we needed this
     * @param count
     */
    updateSimpleSearchResultsCount( count: number ) {
        if( this.simpleSearchResultsCount !== count ){
            this.simpleSearchResultsCount = count;
            this.simpleSearchResultsCountEmitter.emit( count );
        }
    }

    getSimpleSearchResultsCount() {
        return this.simpleSearchResultsCount;
    }

    updateCartCount( count: number ) {
        this.cartCountEmitter.emit( count );
        if( count === 0 ){
            this.clearCart();
        }
    }

    /**
     * Called by ResultsPageComponent<br><br>
     *
     * Subscribed to by SearchResultsComponent to update the top "Search results Showing X - X+ResultsPerPage"<br>
     * Subscribed to by SearchResultsTableComponent to know how many rows to display.<br>
     * Subscribed to by SearchResultsPagerComponent to know how many pages to use for the Pager.
     *
     * @param count
     */
    updateSearchResultsPerPage( count: number ) {
        this.resultsPerPage = count;
        this.searchResultsPerPageEmitter.emit( count );
    }

    getResultsPerPage() {
        return this.resultsPerPage;
    }


    updateCartsPerPage( count: number ) {
        this.cartsPerPageEmitter.emit( count );
    }

    /**
     * Called by SearchResultsPagerComponent when the current pages changes.<br><br>
     *
     * Subscribed to by SearchResultsComponent to update the top "Search results Showing X - X+ResultsPerPage"<br>
     * Subscribed to by SearchResultsTableComponent to know which rows to display.
     *
     * @param page
     */
    updateCurrentSearchResultsPage( page: number ) {
        this.searchResultsPageEmitter.emit( page );
    }

    updateCurrentCartPage( page: number ) {
        this.cartPageEmitter.emit( page );
    }

    /**
     * Toggles then emits the current state of the Search results columns Checkbox popup.<br>
     * This is called by the button bar button<br>
     *
     * Subscribed to by SearchResultsColumnSelectorComponent (the Popup)<br>
     */
    showSearchResultsColumn() {
        this.showSearchResultsColumnState = !this.showSearchResultsColumnState;
        this.showSearchResultsColumnEmitter.emit( this.showSearchResultsColumnState );
    }

    getShowSearchResultsColumnState() {
        return this.showSearchResultsColumnState;
    }


    /**
     * Sets, then emits the current state of the Search results columns Checkbox popup.<br>
     * This is called by the button bar button<br>
     *
     * Subscribed to by SearchResultsColumnSelectorComponent (the Popup)
     *
     * @param state Current state of the "Search results columns Checkbox popup".
     */
    setShowSearchResultsColumn( state: boolean ) {
        this.showSearchResultsColumnState = state;
        this.showSearchResultsColumnEmitter.emit( this.showSearchResultsColumnState );
    }

    /**
     * For when we need to change the tab without the user clicking on it.
     *
     * @param tabNumber
     */
    selectDataTab( tabNumber ) {
        if( this.resultsDisplayMode === Consts.SIMPLE_SEARCH ){
            this.setSimpleSearchDataTab( tabNumber );
        }
        this.selectDataTabEmitter.emit( tabNumber );
    }


    sharedListSavePopupButton( inputType ) {
        this.sharedListSavePopupEmitter.emit( inputType );
    }


    // Save cart as shared list with random name.
    saveMyCartPopupButton() {
        this.saveMyCartPopupEmitter.emit();
    }

    /**
     */
    sharedListDoSave( sharedListName, sharedListDescription, sharedListUrl ) {
        this.sharedListSaveFromCartEmitter.emit( {
            name: sharedListName,
            description: sharedListDescription,
            url: sharedListUrl
        } );
    }

    /**
     * Tell cartComponent that save shared list button has been clicked
     */
    cartListDownLoadButton(downloadTool) {
        this.cartListDownLoadEmitter.emit( downloadTool);
    }

    /**
     * Tells downloader-download component that we need to launch the Popup with the link to the TCIA Download app.
     */
    downloaderDownLoadButton( downloadTool ) {
        this.downloaderDownLoadEmitter.emit( downloadTool );
    }

    /**
     * Called when the "Export spreadsheet" button on the Cart screen.
     * This emitter is subscribed to by the CartComponent
     *
     * @param cartList Same date we display in the Cart screen @TODO Make sure this is all the data we want
     */
    downloadCartAsCsv( cartList ) {
        // Make sure we have data.
        if( !this.utilService.isNullOrUndefined( cartList ) ){
            this.downloadCartAsCsvEmitter.emit( cartList );
        }
    }

    /**
     *
     * @param obj
     * @returns {boolean}
     */
    buildPath( part0, part1, part2?, part3?, part4?, part5? ) {
        let separator = '/';
        let path = '';

        part0.replace( separator + '$', '' );
        path = part0;

        path += this.addSeparator( part1, separator );

        if( !this.utilService.isNullOrUndefined( part2 ) ){
            path += this.addSeparator( part2, separator );
        }
        if( !this.utilService.isNullOrUndefined( part3 ) ){
            path += this.addSeparator( part3, separator );
        }
        if( !this.utilService.isNullOrUndefined( part4 ) ){
            path += this.addSeparator( part4, separator );
        }
        if( !this.utilService.isNullOrUndefined( part5 ) ){
            path += this.addSeparator( part5, separator );
        }

        return path;
    }

    addSeparator( str, separator ) {
        str.replace( '^' + separator, '' );
        return separator + str;
    }

    /**
     * For the Display query we need to swap month and day in the string.
     * @param dateString
     */
    swapMonthDay( dateString ) {
        let m = dateString.substr( 3, 2 );
        let d = dateString.substr( 0, 2 );
        return (m + '/' + d + dateString.substr( 5, 5 ));
    }

}
