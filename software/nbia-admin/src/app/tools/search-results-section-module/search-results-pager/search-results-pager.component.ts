import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Properties } from '@assets/properties';
import { SearchResultsPagerService } from '@app/tools/search-results-section-module/search-results-pager/search-results-pager.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-search-results-pager',
    templateUrl: './search-results-pager.component.html',
    styleUrls: ['./search-results-pager.component.scss']
} )
export class SearchResultsPagerComponent implements OnInit, OnDestroy{

    @Input() currentPage = 0;
    /**
     * Total number of results (not pages).
     */
    @Input() totalCount;

    /**
     * The currently visible page, when this value changes, it is emitted by a call to commonService.updateCurrentSearchResultsPage or<br>
     * commonService.updateCurrentCartPage.
     * @type {number}
     */
    //  currentPage = 0;

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
     * An array representing each button, this currently just holds the text for the button (which is just the index plus one).
     * @type {Array}
     */
    buttons = [];

    pageCount = 0;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private searchResultsPagerService: SearchResultsPagerService ) {
    }

    ngOnInit() {
        this.searchResultsPagerService.pageCountEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe( ( data ) => {
            this.pageCount = data;
            this.setButtons();
            console.log( 'MHL SearchResultsPagerComponent pageCount: ', this.pageCount );
        } );

        this.searchResultsPagerService.nextPageEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe( () => {
            this.onGoNextClick();
            console.log( 'MHL SearchResultsPagerComponent nextPageEmitter' );
        } );


    }


    /**
     * Initialize the buttons with their correct numbers - called when row count, or rows per page changes.
     */
    setButtons() {
        this.buttons = [];
        for( let f = 0; f < this.pageCount; f++ ){
            this.buttons[f] = f;
        }
        if( this.pageCount < this.currentPage ){
            this.onGoLastClick();
        }
    }


    onGoFirstClickClick() {
        this.currentPage = 0;
        this.buttonShowOffset = 0;
        this.searchResultsPagerService.currentPageChangeEmitter.emit( this.currentPage );
    }

    onGoPreviousClick() {
        this.currentPage--;
        if( this.currentPage < 0 ){
            this.currentPage = 0;
        }else{
            this.searchResultsPagerService.currentPageChangeEmitter.emit( this.currentPage );
        }

        if( this.currentPage < this.buttonShowOffset ){
            this.buttonShowOffset--;
        }

    }

    onGoNextClick() {
        if( this.pageCount === (this.currentPage + 1) ){
            return;
        }

        this.currentPage++;
        this.searchResultsPagerService.currentPageChangeEmitter.emit( this.currentPage );

        if( this.currentPage > (this.buttonShowOffset + this.maxButtonsToShow - 1) ){
            this.buttonShowOffset++;
        }

    }

    onGoLastClick() {
        this.currentPage = this.pageCount - 1;
        this.buttonShowOffset = this.pageCount - this.maxButtonsToShow;
        this.searchResultsPagerService.currentPageChangeEmitter.emit( this.currentPage );
    }

    onClick( i ) {
        this.currentPage = i;
        this.searchResultsPagerService.currentPageChangeEmitter.emit( this.currentPage );

    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
