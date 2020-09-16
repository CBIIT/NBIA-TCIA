import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { PersistenceService } from '../../services/persistence.service';
import { Properties } from '@assets/properties';
import { Consts } from '@app/consts';
import { UtilService } from '@app/common/services/util.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-search-results-pager',
    templateUrl: './search-results-pager.component.html',
    styleUrls: ['./search-results-pager.component.scss',
        '../../../image-search/data-section/data-section-tabs/search-results/search-results-table/search-results-table.component.scss']
} )

/**
 * The Results Page UI at the bottom right corner of the Search results and Cart List displays.
 * The Search results and Cart List displays are two different values, but they both use this UI component.
 */
export class SearchResultsPagerComponent implements OnInit, OnDestroy{
    /**
     * Total number of results (not pages).
     */
    totalCount;

    /**
     * Total number of pages, not just the visible pages.<br><br>
     * totalCount / countPerPage rounded up.
     */
    pageCount;

    /**
     * Number of rows to display for each page.<br>
     * This is initialized from a persisted value,<br>
     * If there is no persisted value, then it is initialized from a default - Properties.ROWS_PER_PAGE_CHOICE_DEFAULT.
     */
    countPerPage;

    /**
     * An array representing each button, this currently just holds the text for the button (which is just the index plus one).
     * @type {Array}
     */
    buttons = [];

    /**
     * The currently visible page, when this value changes, it is emitted by a call to commonService.updateCurrentSearchResultsPage or<br>
     * commonService.updateCurrentCartPage.
     * @type {number}
     */
    currentPage = 0;

    /**
     * How many "Number" buttons to show if there are more than Properties.MAX_PAGER_BUTTONS pages.
     * @type {number}
     */
    maxButtonsToShow = Properties.MAX_PAGER_BUTTONS;

    /**
     * If there are more than Properties.MAX_PAGER_BUTTONS pages, the visible number buttons will scroll.<br>
     * This is the first (left most) visible button.  Zero is the first page.
     * @type {number}
     */
    buttonShowOffset = 0;

    /**
     * @TODO explain
     * @type {number}
     */
    direction = 0;

    /**
     * Search results, or a Cart list.
     */
    @Input() displayDataType;
    @Input() isTopPager;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private persistenceService: PersistenceService,
                 private utilService: UtilService ) {
    }

    ngOnInit() {

        // Initialize pageCount, it gets updated when the user changes "Rows per Page", but we don't have it yet,
        // we can get it from the persistence service.
        if( this.displayDataType === Consts.DISPLAY_DATA_TYPE_SEARCH_RESULTS ){
            try{
                this.countPerPage = this.persistenceService.get( this.persistenceService.Field.SEARCH_RESULTS_ROWS_PER_PAGE );
            }catch( e ){
            }
        }
        else if( this.displayDataType === Consts.DISPLAY_DATA_TYPE_CART_LIST ){
            try{
                this.countPerPage = this.persistenceService.get( this.persistenceService.Field.CARTS_PER_PAGE );
            }catch( e ){
            }
        }

        if( this.utilService.isNullOrUndefined( this.countPerPage ) ){
            this.countPerPage = Properties.ROWS_PER_PAGE_CHOICE_DEFAULT;
        }


        if( this.displayDataType === Consts.DISPLAY_DATA_TYPE_SEARCH_RESULTS ){
            // When the total number of rows changes.
            this.commonService.searchResultsCountEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
                data => {
                    this.totalCount = data;

                    this.pageCount = Math.ceil( this.totalCount / this.countPerPage );
                    this.currentPage = 0;

                    // Removed for paged search  CHECKME
                    if( !Properties.PAGED_SEARCH ){
                        this.onClick( this.currentPage );
                    }
                    this.setButtons();
                }
            );

            // When the number of rows per page changes.
            this.commonService.searchResultsPerPageEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
                data => {
                    this.countPerPage = data;
                    this.pageCount = Math.ceil( this.totalCount / this.countPerPage );
                    // Go back to first page
                    this.currentPage = 0;


                    this.onClick( this.currentPage );
                    this.setButtons();
                }
            );


            // If the other pager changed the page.
            this.commonService.searchResultsPageEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
                data => {
                    if( this.currentPage !== data ){
                        this.direction = this.currentPage - <number>data;

                        if( data < 1 ){  // -1 means go to first bag, but if searching by page don't search again.
                            this.setPageFirst();
                        }
                        else if( this.direction === 1 ){
                            this.setPagePrevious();
                        }
                        else if( this.direction === -1 ){
                            this.setPageNext();
                        }
                        else if( data === (this.pageCount - 1) ){
                            this.stePageLast();
                        }
                        else{
                            this.currentPage = <number>data;
                        }
                    }
                }
            );


        }
        else if( this.displayDataType === Consts.DISPLAY_DATA_TYPE_CART_LIST ){
            // When the total number of rows changes.
            this.commonService.cartCountEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
                data => {
                    this.totalCount = data;
                    this.pageCount = Math.ceil( this.totalCount / this.countPerPage );
                    this.currentPage = 0;
                    this.onClick( this.currentPage );
                    this.setButtons();
                }
            );

            // When the number of rows per page changes.
            this.commonService.cartsPerPageEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
                data => {
                    this.countPerPage = data;
                    this.pageCount = Math.ceil( this.totalCount / this.countPerPage );
                    // Go back to first page
                    this.currentPage = 0;
                    this.onClick( this.currentPage );
                    this.setButtons();
                }
            );
        }

    }

    /**
     * Initialize the buttons with their correct numbers - called when row count, or rows per page changes.
     */
    setButtons() {
        this.buttons = [];
        for( let f = 0; f < this.pageCount; f++ ){
            this.buttons[f] = f;
        }
    }


    /**
     * Called when a number button is clicked, also called by:<br>
     * <ul>
     *     <li>onGoFirstClickClick()</li>
     *     <li>onGoPreviousClick()</li>
     *     <li>onGoNextClick()</li>
     *     <li>onGoLastClick()</li>
     * </ul>
     *
     * @param pageNum  The page to display.
     */
    onClick( pageNum ) {
            this.currentPage = pageNum;
            if( this.displayDataType === Consts.DISPLAY_DATA_TYPE_SEARCH_RESULTS ){
                this.commonService.updateCurrentSearchResultsPage( this.currentPage );
            }else if( this.displayDataType === Consts.DISPLAY_DATA_TYPE_CART_LIST ){
                this.commonService.updateCurrentCartPage( this.currentPage );
            }
    }

    onGoFirstClickClick() {
        this.setPageFirst();
        this.onClick( this.currentPage );
    }

    setPageFirst() {
        this.currentPage = 0;
        this.buttonShowOffset = 0;
    }

    onGoPreviousClick() {
        this.setPagePrevious();
        this.onClick( this.currentPage );
    }

    setPagePrevious() {
        if( this.currentPage > 0 ){
            this.currentPage--;
        }
        if( this.currentPage < this.buttonShowOffset ){
            this.buttonShowOffset--;
        }
    }

    onGoNextClick() {
        this.setPageNext();
        this.onClick( this.currentPage );
    }

    setPageNext() {
        if( this.currentPage < (this.pageCount - 1) ){
            this.currentPage++;
        }
        if( this.currentPage > (this.buttonShowOffset + this.maxButtonsToShow - 1) ){
            this.buttonShowOffset++;
        }
    }


    onGoLastClick() {
        this.stePageLast();
        this.onClick( this.currentPage );
    }

    stePageLast() {
        this.buttonShowOffset = this.pageCount - this.maxButtonsToShow;
        this.currentPage = this.pageCount - 1;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
