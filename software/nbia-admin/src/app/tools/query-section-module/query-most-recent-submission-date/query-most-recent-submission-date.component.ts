// -------------------------------------------------------------------------------------------
// -------------------------   Most recent Submission date range   ---------------------------
// -------------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilService } from '@app/admin-common/services/util.service';
import { QuerySectionService } from '../services/query-section.service';
import { Consts } from '@app/constants';
import { takeUntil } from 'rxjs/operators';
import { DisplayQueryService } from '../../display-query-module/display-query/display-query.service';
import { PreferencesService } from '@app/preferences/preferences.service';


@Component( {
    selector: 'nbia-query-most-recent-submission-date',
    templateUrl: './query-most-recent-submission-date.component.html',
    styleUrls: [
        './query-most-recent-submission-date.component.scss',
        '../left-section/left-section.component.scss',
    ],
} )

export class QueryMostRecentSubmissionDateComponent
    implements OnInit, OnDestroy{
    @Input() isTop = false;
    @Input() currentTool;
    showCriteriaList = true;

    toDateModel = null;
    fromDateModel = null;
    checked = false;
    disableUseDateRange = true;
    dateRangeTrailer = null;

    currentFont;
    consts = Consts;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private utilService: UtilService,
        private querySectionService: QuerySectionService,
        private displayQueryService: DisplayQueryService,
        private preferencesService: PreferencesService
    ) {
    }

    ngOnInit() {
        // Holds previous value to determine if the value has actually change.
        this.dateRangeTrailer = null;

        // When the "Clear" button in the Display query at the top is clicked.
        this.displayQueryService.clearQuerySectionQueryEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( () => {
                this.onDateRangeClearAllClick();
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

    isAllEmpty() {
        if(
            !this.utilService.isNullOrUndefined( this.fromDateModel ) &&
            !this.utilService.isNullOrUndefined( this.fromDateModel['date'] )
        ){
            return false;
        }
        return !(
            !this.utilService.isNullOrUndefined( this.toDateModel ) &&
            !this.utilService.isNullOrUndefined( this.toDateModel['date'] )
        );
    }

    onDateRangeClearAllClick() {
        // this.setToDateToToday();
        this.toDateModel = null;
        this.fromDateModel = null;
        this.disableUseDateRange = true;
        this.checked = false;
        this.updateQuery( null );
    }

    setToDateToToday() {
        this.toDateModel = new Date();
    }

    /**
     * When the user clicks the "Apply" checkbox, add the date criteria to the query.
     * If they are un-checking the "Apply" checkbox, remove the date range from the query.
     *
     */
    onApplyCheckboxChange() {
        let datRangeForQuery;
        if( this.checked ){
            datRangeForQuery = (
                this.fromDateModel['formatted'] +
                ',' +
                this.toDateModel['formatted']
            ).replace( /\//g, '-' );
            this.updateQuery( datRangeForQuery );
        }else{
            this.updateQuery( null );
        }
    }

    updateQuery( dateRangeForQuery ) {
        if(
            dateRangeForQuery === null ||
            this.dateRangeTrailer === null ||
            dateRangeForQuery.localeCompare( this.dateRangeTrailer ) !== 0
        ){
            this.querySectionService.updateSearchQuery(
                this.currentTool,
                Consts.QUERY_CRITERIA_MOST_RECENT_SUBMISSION,
                dateRangeForQuery
            );
        }
        this.dateRangeTrailer = dateRangeForQuery;
    }

    onDateChangedTo( e ) {
        this.validateDateRange();
        this.onApplyCheckboxChange();
    }

    onDateChangedFrom( e ) {
        this.validateDateRange();
        this.onApplyCheckboxChange();
    }


    validateDateRange() {
        this.disableUseDateRange = false;
        // Check for a value in "from date" and "to date"
        if(
            this.utilService.isNullOrUndefined( this.fromDateModel ) ||
            this.utilService.isNullOrUndefined( this.toDateModel )
        ){
            this.disableUseDateRange = true;
            return;
        }

        // Check for From date before To date
        if( this.toDateModel < this.fromDateModel ) {
            this.disableUseDateRange = true;
        }

        if( this.disableUseDateRange ){
            if( this.checked ){
                this.updateQuery( null );
            }
            this.checked = false;
        }
    }

    initializeDisableFutureDates() {
        let today = new Date();
        // Add one day
        today = new Date( today.getTime() + 1000 * 60 * 60 * 24 );
        // this.dateOptions.disableSince = {
        //     year: today.getFullYear(),
        //     month: today.getMonth() + 1,
        //     day: today.getDate(),
        // };
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
