// -------------------------------------------------------------------------------------------
// ------------  The parent component of the left side criteria selecting components  --------
// -------------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { QuerySectionService } from '../services/query-section.service';
import { PreferencesService } from '@app/preferences/preferences.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component( {
    selector: 'nbia-query-section',
    templateUrl: './query-section.component.html',
    styleUrls: ['./query-section.component.scss']
} )

export class QuerySectionComponent implements OnInit, OnDestroy{
    /**
     * If this component is used by perform QC we need to show the QC status section.
     * If this component is used by approve-deletions, do not show the QC status section.
     * This value is set by the parent html.
     */
    @Input() currentTool;

    /**
     * Show or hide the entire left query section.
     */
    show = true;

    /**
     * Criteria Search or Text Search.
     */
    currentTab = Consts.CRITERIA_SEARCH;

    currentFont;
    consts = Consts;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
    constructor( private querySectionService: QuerySectionService, private preferencesService: PreferencesService) {
    }

    ngOnInit() {
        this.preferencesService.setFontSizePreferencesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentFont = data;
            } );

        // Get the initial value
        this.currentFont = this.preferencesService.getFontSize();

    }

    onCloserOpenerClick(  ){
        this.show = (! this.show);
    }

    onTabClick(i){
        this.currentTab = i;
        this.querySectionService.setSearchType(this.currentTab);
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
