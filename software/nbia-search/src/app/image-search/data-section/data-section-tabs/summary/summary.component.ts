import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PieChartService } from '@app/image-search/data-section/data-section-tabs/summary/pie-charts/pie-chart.service';

@Component( {
    selector: 'nbia-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    providers: [PieChartService]
} )
export class SummaryComponent implements OnInit, OnDestroy{

    /**
     * Used to display results count above the row of charts.
     * @type {number}
     */
    searchResultsCount = -1;

    /**
     * For hide or show this group of Charts when the arrows next to the heading are clicked.
     */
    showChartViews;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService ) {
    }

     /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param show
     */
     onShowChartViewsClick( show: boolean ) {
        this.showChartViews = show;
    }

    ngOnInit() {

        // Get the total number of rows for the "Search results count:" display at the top
        this.commonService.searchResultsCountEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.searchResultsCount = <number>data;
            }
        );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
