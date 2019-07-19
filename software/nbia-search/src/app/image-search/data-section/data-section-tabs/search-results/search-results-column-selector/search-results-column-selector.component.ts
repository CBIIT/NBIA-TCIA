import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Consts } from '@app/consts';
import { PersistenceService } from '@app/common/services/persistence.service';
import { UtilService } from '@app/common/services/util.service';
import { Properties } from '@assets/properties';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-search-results-column-selector',
    templateUrl: './search-results-column-selector.component.html',
    styleUrls: ['./search-results-column-selector.component.scss']
} )


export class SearchResultsColumnSelectorComponent implements OnInit, OnDestroy{

    /**
     * Used by the HTML to hide or show the entire component.
     * @type {boolean}
     */
    showSelector = false;

    /**
     * All the data for each column name:
     * <ul>
     *     <li>"name"</li>
     *     <li>"selected"</li>
     *     <li>"required"</li>
     *     <li>"textSearch"</li>
     *     <li>"criteriaSearch"</li>
     *     <li>"seq"  I am not using "seq" and will probably remove it in the future.</li>
     *  </ul>
     *
     * The initial values come from persisted values or Conts.DEFAULT_SEARCH_RESULTS_COLUMNS.
     */
    colNames;

    /**
     *  Used to determine if the "Simple search" or the "Free text" column names are shown.
     */
    currentSearchMode;

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

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private persistenceService: PersistenceService,
                 private utilService: UtilService ) {

        // currentSearchMode tells us if the "Simple search" or the "Free text" column names are shown.
        // We need the Consts.SEARCH_TYPES array, because persistenceService.Field.QUERY_TYPE_TAB is a number, and currentSearchMode needs the string
        try{
            this.currentSearchMode = Consts.SEARCH_TYPES[this.persistenceService.get( this.persistenceService.Field.QUERY_TYPE_TAB )];
        }catch( e ){
        }
        // If there is no persisted value, use SEARCH_TYPE_DEFAULT.
        if( this.utilService.isNullOrUndefined( this.currentSearchMode ) ){
            this.currentSearchMode = Consts.SEARCH_TYPES[Consts.SEARCH_TYPE_DEFAULT];
        }

    }

    ngOnInit() {

        // Tells us when the 'Select Display Columns' button (which launches/shows this popup, goes up or down
        this.commonService.showSearchResultsColumnEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.setShowSelector( <boolean>data );
            }
        );

        // Updates the Search type, so we know if the "Simple search" or the "Free text" column names are shown.
        this.commonService.resultsDisplayModeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentSearchMode = data;
            }
        );


        // Set the initial list and their default settings
        try{
            this.colNames = this.persistenceService.get( this.persistenceService.Field.SEARCH_RESULTS_COLUMNS );
            // @TODO
            // This work around can be removed in the near future.  "Cart" is changing from not required to required,
            // this data is in the cookie, so we need to give users a little time for this change to get into their cookie.
            // 23_MAY_2018
            if( !this.utilService.isNullOrUndefined( this.colNames ) && this.colNames.length > 0 ){
                for( let column of this.colNames ){
                    if( column['name'] === 'Cart' ){
                        column['required'] = true;
                    }
                }
            }
        }catch( e ){
        }
        // If there was no 'SEARCH_RESULTS_COLUMNS' previously persisted, no problem, we have a default in Consts.
        if( this.utilService.isNullOrUndefined( this.colNames ) || this.colNames.length < 1 ){
            this.colNames = Consts.DEFAULT_SEARCH_RESULTS_COLUMNS;
        }

        this.commonService.updateSearchResultsColumnList( this.colNames );

    }

    toggleShow() {
        this.showSelector = !this.showSelector;
    }

    /**
     * Called when the button to popup/hide is clicked.
     *
     * @param {boolean} show
     */
    setShowSelector( show: boolean ) {
        this.showSelector = show;
    }

    /**
     * Passes on the list of columns when ever it changes.
     *
     * @param i  Is th column index, don't use this (maybe later)
     */
    onClick( i ) {
        this.commonService.updateSearchResultsColumnList( this.colNames );
        this.persistenceService.put( this.persistenceService.Field.SEARCH_RESULTS_COLUMNS, this.colNames );
    }

    /**
     * Hides this popup, if the user clicks outside of the popup.
     *
     * @param e
     */
    onClickedOutside( e ) {

        // FIXME  this should be a constant - needs to match button ID in TopRightButtonGroupComponent
        if( e.target['id'] !== 'selectDisplayColumnsButton' ){
            this.commonService.setShowSearchResultsColumn( false );
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
