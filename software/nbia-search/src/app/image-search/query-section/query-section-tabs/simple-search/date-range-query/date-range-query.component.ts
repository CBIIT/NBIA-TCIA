import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { UtilService } from '@app/common/services/util.service';
import { IMyDateModel, INgxMyDpOptions, NgxMyDatePickerDirective } from 'ngx-mydatepicker';
import { Consts } from '@app/consts';
import { ParameterService } from '@app/common/services/parameter.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { Properties } from '@assets/properties';
import { ApiServerService } from '@app/image-search/services/api-server.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-date-range-query',
    templateUrl: './date-range-query.component.html',
    styleUrls: ['../simple-search.component.scss', './date-range-query.component.scss']
} )
export class DateRangeQueryComponent implements OnInit, OnDestroy{

    fromDate: Date;
    toDate: Date;
    showCriteriaList = true;
    // disableUseDateRange = true;
    allEmpty = true;
    checked = false;
    // ------------------------------------------------------

    disableUseDateRange = true;

    /*
     dayLabels?: IMyDayLabels;
     monthLabels?: IMyMonthLabels;
     dateFormat?: string;
     showTodayBtn?: boolean;
     todayBtnTxt?: string;
     firstDayOfWeek?: string;
     satHighlight?: boolean;
     sunHighlight?: boolean;
     highlightDates?: Array<IMyDate>;
     markCurrentDay?: boolean;
     markCurrentMonth?: boolean;
     markCurrentYear?: boolean;
     monthSelector?: boolean;
     yearSelector?: boolean;
     disableHeaderButtons?: boolean;
     showWeekNumbers?: boolean;
     selectorHeight?: string;
     selectorWidth?: string;
     disableUntil?: IMyDate;
     disableSince?: IMyDate;
     disableDates?: Array<IMyDate>;
     enableDates?: Array<IMyDate>;
     markDates?: Array<IMyMarkedDates>;
     markWeekends?: IMyMarkedDate;
     disableDateRanges?: Array<IMyDateRange>;
     disableWeekends?: boolean;
     alignSelectorRight?: boolean;
     openSelectorTopOfInput?: boolean;
     closeSelectorOnDateSelect?: boolean;
     minYear?: number;
     maxYear?: number;
     showSelectorArrow?: boolean;
     ariaLabelPrevMonth?: string;
     ariaLabelNextMonth?: string;
     ariaLabelPrevYear?: string;
     ariaLabelNextYear?: string;
     */
    dateOptions: INgxMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy',
        sunHighlight: true,
        satHighlight: true,
        firstDayOfWeek: 'su',
        markCurrentDay: true,
        selectorHeight: '232px',
        selectorWidth: '295px'
    };

    // We need this to access clearDate() within this.onDateRangeClearAllClick
    @ViewChild( 'dpFrom', {static: true} ) ngxdpFrom: NgxMyDatePickerDirective;
    @ViewChild( 'dpTo', {static: true} ) ngxdpTo: NgxMyDatePickerDirective;

    toDateModel = {};
    fromDateModel = {};

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private parameterService: ParameterService,
                 private initMonitorService: InitMonitorService, private queryUrlService: QueryUrlService,
                 private apiServerService: ApiServerService, private utilService: UtilService ) {
    }

    ngOnInit() {
        // Start with no dates entered
        this.onDateRangeClearAllClick( false );


        // Get persisted showCriteriaList
        this.showCriteriaList = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_AVAILABLE );
        if( this.utilService.isNullOrUndefined( this.showCriteriaList ) ){
            this.showCriteriaList = Consts.SHOW_CRITERIA_QUERY_AVAILABLE_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_AVAILABLE, this.showCriteriaList );
        }

        // Used when the Clear button is clicked in the Display Query
        this.commonService.resetAllSimpleSearchEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            () => {
                this.totalQueryClear();
            }
        );

        // Just set the dates, not the 'Apply "Available" date range'
        this.parameterService.parameterDateRangeEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {

                // Make sure the "No future dates" is update.
                this.initializeDisableFutureDates();

                let twoDates = (<any>data).split( /-/ );
                let dateParts = twoDates[0].split( /\// );

                this.fromDateModel = {
                    'date': {
                        'month': +dateParts[0],
                        'day': +dateParts[1],
                        'year': +dateParts[2]
                    }
                };
                dateParts = twoDates[1].split( /\// );

                this.toDateModel = {
                    'date': {
                        'month': +dateParts[0],
                        'day': +dateParts[1],
                        'year': +dateParts[2]
                    }
                };
                this.checked = true;
                this.disableUseDateRange = false;
                this.onDateChange();
                this.commonService.setHaveUserInput( false );


            }
        );

        this.initializeDisableFutureDates();

        this.initMonitorService.setDateRangeInit( true );


    }

    initializeDisableFutureDates() {
        let today = new Date();
        // Add one day
        today = new Date( today.getTime() + (1000 * 60 * 60 * 24) );
        this.dateOptions.disableSince = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
        };
    }

    /**
     * Called when the user is totally clearing the complete current query
     */
    totalQueryClear() {
        this.onDateRangeClearAllClick( true );
    }


    /**
     *
     * @param {boolean} totalClear  true = the user has cleared the complete current query - no need to rerun the query
     */
    onDateRangeClearAllClick( totalClear: boolean ) {
        this.commonService.setHaveUserInput( true );


        this.setToDateToToday();
        this.setFromDate( Properties.LAST_ACCESS );
        this.checked = false;
        this.disableUseDateRange = true;

       // this.validateDateRange();

/*

        if( this.fromDateModel !== undefined ){
            this.fromDateModel = {};
            this.ngxdpFrom.clearDate();
        }

        if( this.toDateModel !== undefined ){
            this.toDateModel = {};
            this.ngxdpTo.clearDate();
        }

        if( !totalClear ){
            let datRangeForQuery: string[] = [];
            datRangeForQuery[0] = 'DateRangeCriteria';
            this.commonService.updateQuery( datRangeForQuery );
        }

*/
        this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );

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
     *
     * @param theDate
     */
    setFromDate( theDate ) {
        let newFromDate = theDate.date;
        this.fromDateModel = {};
        this.fromDateModel['date'] = {};
        this.fromDateModel['date']['day'] = newFromDate['day'];
        this.fromDateModel['date']['month'] = newFromDate['month'];
        this.fromDateModel['date']['year'] = newFromDate['year'];
    }

    /**
     * Make sure they are real dates, and From is not after To
     *
     * @TODO There are better ways of doing this...
     * @returns {boolean}
     */
    validateDateRange() {
        this.disableUseDateRange = false;

        // Check for a value in "from date" and "to date"
        if(
            (this.utilService.isNullOrUndefined( this.fromDateModel )) ||
            (this.utilService.isNullOrUndefined( this.fromDateModel['date'] )) ||
            (this.utilService.isNullOrUndefined( this.toDateModel )) ||
            (this.utilService.isNullOrUndefined( this.toDateModel['date'] ))
        ){
            this.disableUseDateRange = true;

            // Remove dateRange (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );
            return;
        }


        // Check for valid day and month
        if(
            (+this.fromDateModel['date']['day'] > this.daysInMonth( this.fromDateModel['date']['month'], this.fromDateModel['date']['year'] )) ||
            (+this.toDateModel['date']['day'] > this.daysInMonth( this.toDateModel['date']['month'], this.toDateModel['date']['year'] )) ||
            (+this.toDateModel['date']['month'] > 12) ||
            (+this.fromDateModel['date']['month'] > 12)
        ){
            this.disableUseDateRange = true;
            // Remove dateRange (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );
            return;
        }

        // Check for from date after to date
        if( this.fromDateModel['date']['year'] > this.toDateModel['date']['year'] ){
            // Bad year
            this.disableUseDateRange = true;
            // Remove dateRange (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );
            return;
        }

        if( (this.fromDateModel['date']['year'] === this.toDateModel['date']['year']) && (this.fromDateModel['date']['month'] > this.toDateModel['date']['month']) ){
            // Bad month
            this.disableUseDateRange = true;
            // Remove dateRange (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );
            return;
        }

        if( (this.fromDateModel['date']['year'] === this.toDateModel['date']['year']) && (this.fromDateModel['date']['month'] === this.toDateModel['date']['month']) && (this.fromDateModel['date']['day'] > this.toDateModel['date']['day']) ){
            // Bad day
            this.disableUseDateRange = true;
            // Remove dateRange (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );
            return;
        }
    }


// Get the number of days in a month
    daysInMonth = function( month, year ) {
        return new Date( year, month, 0 ).getDate();
    };


    onDateChange() {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );

        if( this.disableUseDateRange ){
            this.checked = false;
        }
        else if( this.checked ){
            // This will cause the search to be run.
            this.onApplyCheckboxClick( true );
        }
    }


    onDateChangedTo( e: IMyDateModel ) {
        // We need to do this because "dateChanged" event can happen before the bound variable toDateModel is updated.
        if( !this.utilService.isNullOrUndefined( e.date ) && (e.date.year > 0) ){
            this.toDateModel = { date: { year: 0, month: 0, day: 0 } };
            this.toDateModel['date'] = e.date;
        }
        this.validateDateRange();
        this.onDateChange();

    }

    onDateChangedFrom( e: IMyDateModel ) {
        // We need to do this because "dateChanged" event can happen before the bound variable fromDateModel is updated.
        if( !this.utilService.isNullOrUndefined( e.date ) && (e.date.year > 0) ){
            this.fromDateModel = { date: { year: 0, month: 0, day: 0 } };
            this.fromDateModel['date'] = e.date;
        }
        this.validateDateRange();
        this.onDateChange();
    }


    /**
     * Show or collapse the DateRange component.
     *
     * @param {boolean} show
     */
    onShowAvailableClick( show: boolean ) {
        this.showCriteriaList = show;
        this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_AVAILABLE, this.showCriteriaList );
    }


    isAllEmpty() {

        if( !this.utilService.isNullOrUndefined( this.fromDateModel ) && (!this.utilService.isNullOrUndefined( this.fromDateModel['date'] )) ){
            this.allEmpty = false;
            return false;
        }
        if( !this.utilService.isNullOrUndefined( this.toDateModel ) && (!this.utilService.isNullOrUndefined( this.toDateModel['date'] )) ){
            this.allEmpty = false;
            return false;
        }
        this.allEmpty = true;
        return true;
    }


    /**
     * When the user clicks the "Apply" checkbox, add the date criteria to the query.
     *
     * @param checked
     */
    onApplyCheckboxClick( checked ) {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );

        let datRangeForQuery: string[] = [];
        datRangeForQuery[0] = 'DateRangeCriteria';

        if( checked ){
            // From
            datRangeForQuery[1] = this.makeFormattedDate2( this.fromDateModel['date'] );
            // To
            datRangeForQuery[2] = this.makeFormattedDate2( this.toDateModel['date'] );

            this.checked = true;

            // Update queryUrlService
            this.queryUrlService.update( this.queryUrlService.DATE_RANGE,
                this.makeFormattedDate( this.fromDateModel['date'] ) + '-' + this.makeFormattedDate( this.toDateModel['date'] ) );
        }else{
            this.checked = false;
            // Remove dateRange (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );
        }
        this.commonService.updateQuery( datRangeForQuery );
    }

// Month/Day/Year
    makeFormattedDate( d ) {
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

// Day/Month/Year
    makeFormattedDate2( d ) {
        let date = '';
        if( d.day < 10 ){
            date += '0';
        }
        date += d.day + '/';

        if( d.month < 10 ){
            date += '0';
        }
        date += d.month + '/' + d.year;

        return date;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
