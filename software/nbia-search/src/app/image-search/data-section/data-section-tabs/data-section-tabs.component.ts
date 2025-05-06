import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiServerService } from '../../services/api-server.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { Properties } from '@assets/properties';
import { Consts } from '@app/consts';
import { UtilService } from '@app/common/services/util.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-data-section-tabs',
    templateUrl: './data-section-tabs.component.html',

    // Styles for all tabs are in app/image-search/image-search.component.css
    styleUrls: ['../../image-search.component.scss', './data-section-tabs.component.scss']
} )

export class DataSectionTabsComponent implements OnInit, OnDestroy{
    properties = Properties;
    /**
     * Currently only used by the HTML to know when to disable the "Summary" tab/
     *
     * @type {number}
     */
    @Input() displayType; // FIXME We don't need this anymore
    searchType;
    showTestTab;

    activeTab = 1;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private apiServerService: ApiServerService,
                 private persistenceService: PersistenceService, private utilService: UtilService ) {
    }

    ngOnInit() {

        // For when we need to change the tab without the user clicking on it.
        this.commonService.selectDataTabEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.setTab( data );
                // this.searchType = data;
            }
        );

        // If Simple Search Results are emitted, we know the search type is Simple Search.
        this.apiServerService.simpleSearchResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.updateSearchType();
            }
        );

        /*  No need for this, we react to this error in search-results-table.component.ts
        this.apiServerService.simpleSearchErrorEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            err => {
                console.error( 'DataSectionTabsComponent simpleSearchErrorEmitter.subscribe: ', err );
            }
        );
        */

        // If we are doing a text search, make sure we are not showing the charts 'Summary' tab.
        this.apiServerService.textSearchResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.updateSearchType();

                if( (!this.utilService.isNullOrUndefined( data )) && ((<any>data).length > 0) ){
                    this.setTab( 1 );
                }
            }
        );
        this.apiServerService.textSearchErrorEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            err => {
                console.error( 'DataSectionTabsComponent textSearchErrorEmitter.subscribe: ', err );
            }
        );

        this.updateSearchType();
        this.initTabSelection();

        this.showTestTab = Properties.SHOW_TEST_TAB;
    }

    updateSearchType() {
        // For now, we only need this so we will have searchType at startup, so we can disable "Summary" tab if it's a Text search.
        switch( this.commonService.getResultsDisplayMode() ){
            case Consts.SIMPLE_SEARCH:
                this.searchType = 0;
                break;
            case Consts.TEXT_SEARCH:
                this.searchType = 1;
                break;
        }
    }

    /**
     * Get the users previously selected tab form the browser cookie if there is one.
     */
    initTabSelection() {
        let previousTab = this.persistenceService.get( this.persistenceService.Field.DATA_DISPLAY_TAB );
        if( previousTab != null ){
            this.activeTab = this.persistenceService.get( this.persistenceService.Field.DATA_DISPLAY_TAB );
        }
    }

    // For when we need to change the tab without the user clicking on it.  FIXME this does not (totally) work to change the tab without the user clicking on it.
    setTab( i ) {
        // Save this tab, we will return to this same tab when the site is reloaded/restarted
        if( this.commonService.getResultsDisplayMode() === Consts.SIMPLE_SEARCH ){
            this.commonService.setSimpleSearchDataTab( i );
        }
        this.persistenceService.put( this.persistenceService.Field.DATA_DISPLAY_TAB, i );
    }

    async onTabClick( i ) {
        this.setTab( i );
        this.activeTab = i;
        // TODO explain why we need this
        // Give the charts time to draw, they don't need much
        await this.commonService.sleep( 1 );

        // Redraw the charts, they won't be visible if they where drawn while the tab was not active.
        this.commonService.updateAllCharts();

    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
