import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { Consts } from '@app/consts';
import { UtilService } from '@app/common/services/util.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-data-section',
    templateUrl: './data-section.component.html',
    styleUrls: ['../../app.component.scss']
} )

export class DataSectionComponent implements OnInit, OnDestroy{

    /**
     * Current Data display tab:
     * Summary, Search Results, or Test.  These will be renamed to match the renamed tabs .
     */
    savedDataDisplayTab: number;

    // Which type of search are we displaying the results for.
    displayMode: string;

    // So the html has access
    SIMPLE_SEARCH = Consts.SIMPLE_SEARCH;
    CRITERIA_SEARCH = Consts.CRITERIA_SEARCH;
    TEXT_SEARCH = Consts.TEXT_SEARCH;

    showDataSection = true;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private persistenceService: PersistenceService,
                 private utilService: UtilService ) {
    }

    ngOnInit() {

        this.commonService.showDataSectionEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.showDataSection = <boolean>data;
            }
        );

        // Get current search tab/mode, it will be one of the following:  TODO Rename these to match the renamed tabs
        // Consts.SIMPLE_SEARCH
        // Consts.TEXT_SEARCH
        // Consts.CRITERIA_SEARCH
        this.commonService.resultsDisplayModeEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.displayMode = <string>data;
            }
        );

        /**
         * Set the current Data display tab from persisted setting, if there is one
         * Summary, Search Results, or Test
         */
        try{

            this.savedDataDisplayTab = JSON.parse( this.persistenceService.get( this.persistenceService.Field.DATA_DISPLAY_TAB ) );
        }catch( e ){
        }
        if( this.utilService.isNullOrUndefined( this.savedDataDisplayTab ) ){

            // If there was no 'dataDisplayTab' previously persisted, no problem, default to tab 1 "Search Results".
            this.savedDataDisplayTab = 0; // "Summary" default tab.
        }

        // checkme This is a work around.  The charts in the second tab do not get rendered if the tab is not active when their component ngOnInit runs
        this.initChartTab();
    }

    /**
     * @checkme This is a work around.  The charts in the second tab do not get rendered if the tab is not active when their component ngOnInit runs
     * Functions which use await, must be declared "async"
     *
     * @returns {Promise<void>}
     */
    async initChartTab() {
        // Give the charts time to draw, they don't need much
        await this.commonService.sleep( 1 );
        // Now switch away from the "Summary" (charts) tab to what ever had been persisted, or the default.
        this.commonService.selectDataTab( this.savedDataDisplayTab );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
