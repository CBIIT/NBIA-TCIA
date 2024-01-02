import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { UtilService } from '@app/common/services/util.service';
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
    applyCheckboxCalender = false;

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
        this.commonService.resetAllSimpleSearchEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.totalQueryClear();
                this.onDateRangeClearAllClick( false ); // @CHECKME
            }
        );

        // Just set the dates, not the 'Apply "Available" date range'
        this.parameterService.parameterDateRangeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {

                // Make sure the "No future dates" is update.
                this.initializeDisableFutureDates();

                let twoDates = (<any>data).split( /-/ );
                let dateParts = twoDates[0].split( /\// );

                dateParts = twoDates[1].split( /\// );

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
        this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );

        this.commonService.setHaveUserInput( true );

        this.setToDateToToday();
        this.setFromDate( Properties.LAST_ACCESS );
        this.checked = false;
        this.disableUseDateRange = true;
        this.applyCheckboxCalender = false;

        this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );

    }


    setToDateToToday() {
        this.toDate = new Date();
    }


    /**
     *
     * @param theDate
     */
    setFromDate( theDate ) {
        this.fromDate = theDate;
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
            (this.utilService.isNullOrUndefined( this.fromDate )) ||
            (this.utilService.isNullOrUndefined( this.toDate ))
        ){
            this.disableUseDateRange = true;

            // Remove dateRange (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );
            return;
        }


        // Check for from date after to date
        if( this.fromDate > this.toDate ){
            // Bad year
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
        }else if( this.checked ){
            // This will cause the search to be run.
            this.onApplyCheckboxClick( true );
        }
    }


    onDateChangedTo( e) {
        this.validateDateRange();
        this.onDateChange();

    }

    onDateChangedFrom( e) {
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

        if( !this.utilService.isNullOrUndefined( this.fromDate ) ){
            this.allEmpty = false;
            return false;
        }
        if( !this.utilService.isNullOrUndefined( this.toDate ) ){
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

        this.checked = checked;
        let datRangeForQuery: string[] = [];
        datRangeForQuery[0] = 'DateRangeCriteria';

        if( checked ){
            // From
            datRangeForQuery[1] = this.makeFormattedDate( this.fromDate );
            // To
            datRangeForQuery[2] = this.makeFormattedDate( this.toDate );

            // Update queryUrlService
            this.queryUrlService.update( this.queryUrlService.DATE_RANGE,
                this.makeFormattedDate( this.fromDate ) + '-' + this.makeFormattedDate( this.toDate ) );
        }else{
            // Remove dateRange (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );
        }
        this.commonService.updateQuery( datRangeForQuery );
    }

    makeFormattedDate( dateStr ) {
      // Split the input date string, which is in the format "YYYY-MM-DD"
      const parts = dateStr.split('-'); // parts[0] is year, parts[1] is month, parts[2] is day

      // Reorder the parts and join them with slashes to get "MM/DD/YYYY"
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
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
