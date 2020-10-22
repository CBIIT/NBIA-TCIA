// -------------------------------------------------------------------------------------------
// -------------------------     Collection search criteria        ---------------------------
// -------------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { Subject } from 'rxjs';
import { QuerySectionService } from '../services/query-section.service';
import { Consts } from '@app/constants';
import { DisplayQueryService } from '../../display-query-module/display-query/display-query.service';
import { LoginService } from '@app/login/login.service';
import { ResizedEvent } from 'angular-resize-event';
import { PreferencesService } from '@app/preferences/preferences.service';


@Component( {
    selector: 'nbia-query-collection',
    templateUrl: './query-collection.component.html',
    styleUrls: [
        './query-collection.component.scss',
        '../left-section/left-section.component.scss',
    ],
} )

export class QueryCollectionComponent implements OnInit, OnDestroy{
    @Input() currentTool;

    /**
     * Used by the UI search within this criteria list (with the red magnifying glass), NOT the data search.
     *
     * @type {boolean}
     */
    searchHasFocus = false;

    searchXHasFocus = false;
    searchTextHasFocus = false;
    searchInput = '';

    searchToolTip = 'Search within Collections';
    showSearch = false;

    showCriteriaList = true;
    collections;
    currentCollection = 0;
    cBox = [];
    currentCollectionName = '';

    width: number;
    height: number;

    consts = Consts;
    currentFont;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private apiService: ApiService,
        private utilService: UtilService,
        private querySectionService: QuerySectionService,
        private displayQueryService: DisplayQueryService,
        private loginService: LoginService,
        private preferencesService: PreferencesService
    ) {
    }

    ngOnInit() {
        // For Edit Collection descriptions we only need Collection, NOT Collection//Site.
        if( this.currentTool === Consts.TOOL_EDIT_COLLECTION_DESCRIPTIONS ){
            this.apiService.collectionsAndDescriptionEmitter
                .pipe( takeUntil( this.ngUnsubscribe ) )
                .subscribe( ( data ) => {
                    this.init( data );
                } );
        }
        // For Any other than "Edit Collection descriptions" we need Collection//Site.
        else{
            this.apiService.collectionSitesAndDescriptionEmitter
                .pipe( takeUntil( this.ngUnsubscribe ) )
                .subscribe( ( data ) => {
                    this.init( data );
                } );
            this.apiService.getCollectionSiteAndDescriptions();
        }

        // When the "Clear" button in the Display query at the top is clicked.
        this.displayQueryService.clearQuerySectionQueryEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( () => {
                this.currentCollection = 0;
                this.clearCBox();
                this.cBox[0] = true;
                this.currentCollectionName = this.collections[this.currentCollection]['name'];
                this.querySectionService.updateSearchQuery(
                    this.currentTool,
                    Consts.QUERY_CRITERIA_COLLECTION,
                    this.currentCollectionName
                );
            } );

        // Get font size
        this.preferencesService.setFontSizePreferencesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.currentFont = data;
            } );
        // Get the initial value
        this.currentFont = this.preferencesService.getFontSize();
    }

    init( data ) {
        this.collections = data;
        // Sort
        this.collections.sort( ( a, b ) =>
            a.name.toUpperCase().localeCompare( b.name.toUpperCase() )
        );

        this.clearCBox();
        this.cBox[this.currentCollection] = true;

        this.currentCollectionName = this.collections[this.currentCollection]['name'];
        this.querySectionService.updateSearchQuery(
            this.currentTool,
            Consts.QUERY_CRITERIA_COLLECTION,
            this.currentCollectionName
        );

        let maxInitialCountHeight = 10;
        // Increase height for "Edit Collection Descriptions" because it has only one search criteria.
        if( this.currentTool === Consts.TOOL_EDIT_COLLECTION_DESCRIPTIONS ){
            maxInitialCountHeight = 16;
        }
        // Set height to show all collections, or maxInitialCountHeight collections, which ever is less.
        let h = Math.min( data.length, maxInitialCountHeight ) * 26;
        document.getElementById( 'collections' ).style.height = h + 'px';
    }

    onResized( event: ResizedEvent ) {
        this.width = event.newWidth;
        this.height = event.newHeight;
    }

    onShowCriteriaListClick( s ) {
        this.showCriteriaList = s;
    }

    onCriteriaClicked( i ) {
        this.clearCBox();
        this.cBox[i] = true;
        this.currentCollection = i;
        this.currentCollectionName = this.collections[this.currentCollection][
            'name'
            ];
        this.selectCollection();
    }

    /**
     * Tell other components that this Collection has been selected.
     */
    selectCollection() {
        if( this.currentTool === Consts.TOOL_EDIT_COLLECTION_DESCRIPTIONS ){
            this.querySectionService.emitCollection( this.currentCollection );
        }else{
            this.querySectionService.updateSearchQuery(
                this.currentTool,
                Consts.QUERY_CRITERIA_COLLECTION,
                this.currentCollectionName
            );
            this.onSearchChange();
        }
    }

    clearCBox() {
        for( let i = 0; i < this.collections.length; i++ ){
            this.cBox[i] = false;
            // include is used to filter collections to show when the search/filter magnifying glass tool is used.
            this.collections[i]['include'] = true;
        }
    }

    /**
     * Toggles showing the search input box
     *
     * @note Clears the search text input when showSearch is switched to true
     */
    onSearchGlassClick() {
        this.showSearch = !this.showSearch;
        /*
                if( !this.showSearch ){
                    this.criteriaList = this.criteriaListHold;
                    this.onClearSearchInputClick();
                }
        */
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

    /**
     * When the search, within this criteria list changes, NOT the data search.
     */
    onSearchChange() {
        let n = 0;

        for( let item of this.collections ){
            item['include'] = !!(
                item['name']
                    .toUpperCase()
                    .includes( this.searchInput.toUpperCase() ) || this.cBox[n]
            );
            n++;
        }
        /*
                this.criteriaList = this.sortService.criteriaSort( tempList, this.cBox, this.sortNumChecked );   // sortNumChecked is a bool

                // This is not really needed, it is left from when I allowed the search to continue to be in effect when the text input was not visible.
                if( this.searchInput.length === 0 ){
                    this.searchToolTip = 'Search';
                    this.showAllForSearch = false;
                }else{
                    this.searchToolTip = this.searchInput;
                    this.showAllForSearch = true;
                }
        */
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
