import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Properties } from '../../assets/properties';
import { Subject } from 'rxjs';
import { UtilService } from '../services/util.service';
import { CommonService } from '../services/common.service';
import { ServerAccessService } from '../services/server-access.service';

@Component( {
    selector: 'nbia-pager',
    templateUrl: './pager.component.html',
    styleUrls: ['./pager.component.scss', '../nbia-thumbnail-viewer/nbia-thumbnail-viewer.component.scss']
} )
export class PagerComponent implements OnInit, OnDestroy{
    /**
     * Total number of results (not pages).
     */
    totalCount = 0;

    /**
     * Total number of pages, not just the visible pages.<br><br>
     * totalCount / countPerPage rounded up.
     */
    pageCount;

    /**
     * Number of rows to display for each page.<br>
     * This is initialized from a persisted value,<br>
     * If there is no persisted value, then it is initialized from a default - Properties.IMAGES_PER_PAGE_CHOICE_DEFAULT.
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

    haveData = false;

    /**
     * Search results, or a Cart list.
     */
    @Input() displayDataType;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private util: UtilService, private commonService: CommonService ,
                 private serverAccessService: ServerAccessService) {
    }

    ngOnInit() {
        this.commonService.haveAllDataEmitter.subscribe(
            data => {
                this.haveData = data;
            }
        );

        this.commonService.imageCountEmitter.subscribe(
            data => {
                this.totalCount = data;
                this.pageCount = Math.ceil( this.totalCount / this.countPerPage );
                this.setButtons();
            }
        );


        this.countPerPage = this.commonService.imagesPerPageEmitter.subscribe(
            data => {
                this.countPerPage = +data;
                this.pageCount = Math.ceil( this.totalCount / this.countPerPage );
                this.setButtons();

                if(  Properties.IMAGE_LOAD_MODE === Properties.LOAD_ONE_PAGE){
                    this.serverAccessService.getImages( this.currentPage );
                }

            }
        );

        if( this.util.isNullOrUndefined( this.countPerPage ) ){
            this.countPerPage = Properties.IMAGES_PER_PAGE_CHOICE_DEFAULT;
        }




        /*

                    // When the total number of rows changes.
                    this.commonService.cartCountEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
                        data => {
                            this.totalCount = data;
                            this.pageCount = Math.ceil( this.totalCount / this.countPerPage );
                            this.currentPage = 0;
                            this.onClick( this.currentPage );
                            this.setButtons();
                        }
                    );

                    // When the number of rows per page changes.
                    this.commonService.cartsPerPageEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
                        data => {
                            this.countPerPage = data;
                            this.pageCount = Math.ceil( this.totalCount / this.countPerPage );
                            // Go back to first page
                            this.currentPage = 0;
                            this.onClick( this.currentPage );
                            this.setButtons();
                        }
                    );

        */


        /////////////////
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
        this.commonService.setCurrentPage( this.currentPage );
        if( Properties.IMAGE_LOAD_MODE === Properties.LOAD_ONE_PAGE ){
            this.serverAccessService.getImages( this.currentPage );
        }
    }

    onGoFirstClickClick() {
        this.buttonShowOffset = 0;
        this.onClick( 0 );
    }

    onGoPreviousClick() {
        if( this.currentPage > 0 ){
            this.currentPage--;
        }
        if( this.currentPage < this.buttonShowOffset ){
            this.buttonShowOffset--;
        }
        this.onClick( this.currentPage );
    }

    onGoNextClick() {
        if( this.currentPage < (this.pageCount - 1) ){
            this.currentPage++;
        }
        if( this.currentPage > (this.buttonShowOffset + this.maxButtonsToShow - 1) ){
            this.buttonShowOffset++;
        }
        this.onClick( this.currentPage );
    }

    onGoLastClick() {
        this.buttonShowOffset = this.pageCount - this.maxButtonsToShow;
        this.onClick( this.pageCount - 1 );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}
