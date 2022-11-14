// -------------------------------------------------------------------------------------------
// -----------------------       QC Status criteria (list of checkboxes)       ---------------
// -------------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { QuerySectionService } from '../services/query-section.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisplayQueryService } from '../../display-query-module/display-query/display-query.service';
import { PreferencesService } from '@app/preferences/preferences.service';
import { Properties } from '@assets/properties';


@Component( {
    selector: 'nbia-query-qc-status',
    templateUrl: './query-qc-status.component.html',
    styleUrls: [
        './query-qc-status.component.scss',
        '../left-section/left-section.component.scss',
    ],
} )

export class QueryQcStatusComponent implements OnInit, OnDestroy{
    @Input() isTop = true; // This one defaults to the top.
    @Input() currentTool;

    showCriteriaList = true;
    hasChecked = false;
    cBox = [];
    currentFont;
    qcStatuses = Properties.QC_STATUSES;
    consts = Consts;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private querySectionService: QuerySectionService,
        private displayQueryService: DisplayQueryService,
        private preferencesService: PreferencesService
    ) {
    }

    ngOnInit() {
        // Give the array its initial all false values.
        this.clearCBox();

        // When the "Clear" button in the Display query at the top is clicked.
        this.displayQueryService.clearQuerySectionQueryEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( () => {
                this.onQcStatusClearAllClick();
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

    onShowCriteriaListClick( s ) {
        this.showCriteriaList = s;
    }

    onQcStatusClearAllClick() {
        this.clearCBox();
        this.hasChecked = false;
        this.updateQuery();
    }

    onCheckboxClick( i ) {
        this.cBox[i] = !this.cBox[i];
        this.updateHasChecked();
        this.updateQuery();
    }

    updateHasChecked() {
        this.hasChecked = false;
        for( let f = 0; f < this.cBox.length; f++ ){
            if( this.cBox[f] ){
                this.hasChecked = true;
            }
        }
    }

    updateQuery() {
        if( this.hasChecked ){
            this.querySectionService.updateSearchQuery(
                this.currentTool,
                Consts.QUERY_CRITERIA_QC_STATUS,
                this.cBox
            );
        }else{
            this.querySectionService.updateSearchQuery(
                this.currentTool,
                Consts.QUERY_CRITERIA_QC_STATUS,
                null
            );
        }
    }

    clearCBox() {
        for( let f = 0; f < this.qcStatuses.length; f++ ){
            this.cBox[f] = false;
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
