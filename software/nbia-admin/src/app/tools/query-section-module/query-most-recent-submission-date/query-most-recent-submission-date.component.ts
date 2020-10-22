// -------------------------------------------------------------------------------------------
// -------------------------   Most recent Submission date range   ---------------------------
// -------------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilService } from '@app/admin-common/services/util.service';
import { IMyDateModel, INgxMyDpOptions, NgxMyDatePickerDirective, } from 'ngx-mydatepicker';
import * as moment from 'moment';
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

    dateOptions: INgxMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy',
        sunHighlight: true,
        satHighlight: true,
        firstDayOfWeek: 'su',
        markCurrentDay: true,
        selectorHeight: '232px',
        selectorWidth: '295px',
    };

    // We need this to give access to clearDate() within this.onDateRangeClearAllClick
    @ViewChild( 'dpFrom', { static: true } ) ngxdpFrom: NgxMyDatePickerDirective;
    @ViewChild( 'dpTo', { static: true } ) ngxdpTo: NgxMyDatePickerDirective;

    toDateModel = {};
    fromDateModel = {};
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
        let today = new Date();
        this.toDateModel = {};
        this.toDateModel['date'] = {};
        this.toDateModel['date']['day'] = today.getDate();
        this.toDateModel['date']['month'] = today.getMonth() + 1;
        this.toDateModel['date']['year'] = today.getFullYear();
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

    onDateChangedTo( e: IMyDateModel ) {
        // We need to do this because "dateChanged" event can happen before the bound variable toDateModel is updated.
        if( !this.utilService.isNullOrUndefined( e.date ) && e.date.year > 0 ){
            this.toDateModel = { date: { year: 0, month: 0, day: 0 } };
            this.toDateModel['date'] = e.date;
        }
        this.validateDateRange();
        this.onApplyCheckboxChange();
    }

    onDateChangedFrom( e: IMyDateModel ) {
        // We need to do this because "dateChanged" event can happen before the bound variable fromDateModel is updated.
        if( !this.utilService.isNullOrUndefined( e.date ) && e.date.year > 0 ){
            this.fromDateModel = { date: { year: 0, month: 0, day: 0 } };
            this.fromDateModel['date'] = e.date;
        }
        this.validateDateRange();
        this.onApplyCheckboxChange();
    }

    /**
     * We need to do this because the bound dataModels are not keeping the ['formatted'] field.
     *
     * @param d
     */
    setFormattedDate( d ) {
        if( this.utilService.isNullOrUndefinedOrEmpty( d ) ){
            return '';
        }

        let date = '';
        if( d.month < 10 ){
            date += '0';
        }
        date += d.month + '/';

        if( d.day < 10 ){
            date += '0';
        }
        date += d.day + '/' + d.year;
        return date;
    }

    validateDateRange() {
        this.disableUseDateRange = false;
        // We need to do this because the bound dataModels are not keeping the ['formatted'] field.
        this.toDateModel['formatted'] = this.setFormattedDate(
            this.toDateModel['date']
        );
        this.fromDateModel['formatted'] = this.setFormattedDate(
            this.fromDateModel['date']
        );
        // Check for a value in "from date" and "to date"
        if(
            this.utilService.isNullOrUndefined( this.fromDateModel ) ||
            this.utilService.isNullOrUndefined( this.fromDateModel['date'] ) ||
            this.utilService.isNullOrUndefined( this.toDateModel ) ||
            this.utilService.isNullOrUndefined( this.toDateModel['date'] )
        ){
            this.disableUseDateRange = true;
            return;
        }

        // Check for valid day and months
        let mTo = moment( this.toDateModel['formatted'], 'MM/DD/YYYY' );
        if( !mTo.isValid() ){
            this.disableUseDateRange = true;
        }
        let mFrom = moment( this.fromDateModel['formatted'], 'MM/DD/YYYY' );
        if( !mFrom.isValid() ){
            this.disableUseDateRange = true;
        }

        // Check for From date before To date
        if( mTo.isBefore( mFrom ) ){
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
        this.dateOptions.disableSince = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate(),
        };
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
