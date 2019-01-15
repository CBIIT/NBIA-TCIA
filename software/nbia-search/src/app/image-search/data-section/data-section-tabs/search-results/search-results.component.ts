import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';

import { Subject } from 'rxjs';
import { Consts } from '@app/consts';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss']
} )

export class SearchResultsComponent implements OnInit, OnDestroy{
    rowsPerPage: number;
    lastRow: number;
    firstRow: number = 0;
    currentPage: number = 0;
    totalCount: number = -1;

    /**
     * scroll style, false = 1st/default, 2nd scroll style is still a work in progress.
     * FIXME this (default) needs to match SearchResultsService.scrollFlag
     * @type {boolean}
     */
    scroll = false;

    // For html visibility
    consts = Consts;
    properties = Properties;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService ) {
    }

    ngOnInit() {
        // Get number of rows to display  (per page)
        this.commonService.searchResultsPerPageEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.rowsPerPage = <number>data;

                if( ! Properties.PAGED_SEARCH){
                    this.lastRow = Number( this.firstRow ) + Number( this.rowsPerPage ) - 1;
                }
                else{
                    this.lastRow = Number( this.rowsPerPage ) - 1;
                }
            }
        );

        // Get current page number
        this.commonService.searchResultsPageEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.currentPage = <number>data;
                if(this.currentPage < 0){    // -1 means go to first bag, but if searching by page don't search again.
                    this.currentPage = 0;
                }
                if( ! Properties.PAGED_SEARCH){
                    this.firstRow = this.rowsPerPage * this.currentPage;
                    this.lastRow = this.firstRow + this.rowsPerPage - 1;
                }

            }
        );

        // Toggle scroll style, 2nd scroll style is still a work in progress.
        this.commonService.searchResultsToggleScrollEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.scroll = <boolean>data;
            }
        );

        // Get the total number of rows
        this.commonService.searchResultsCountEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.totalCount = <number>data;
            }
        );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
