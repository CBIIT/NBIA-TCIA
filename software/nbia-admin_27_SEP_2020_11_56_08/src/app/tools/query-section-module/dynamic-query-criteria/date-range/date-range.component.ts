import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IMyDateModel, INgxMyDpOptions, NgxMyDatePickerDirective } from 'ngx-mydatepicker';
import { UtilService } from '@app/admin-common/services/util.service';

@Component( {
    selector: 'nbia-date-range',
    templateUrl: './date-range.component.html',
    styleUrls: ['./date-range.component.scss', '../../left-section/left-section.component.scss']
} )
export class DateRangeComponent implements OnInit{
    @Input() queryCriteriaData;
    sequenceNumber = -1;
    criteriaDateRangeShowCriteria = true;


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
    @ViewChild( 'dpFrom', { static: true } ) ngxdpFrom: NgxMyDatePickerDirective;
    @ViewChild( 'dpTo', { static: true } ) ngxdpTo: NgxMyDatePickerDirective;

    dateRangeToDate = {};
    dateRangeFromDate = {};
    checked = false;

    disableUseDateRange = true;

    constructor( private utilService: UtilService ) {
    }

    ngOnInit() {
    }

    onShowCriteriaClick( state ) {
        this.criteriaDateRangeShowCriteria = state;
    }

    onClearClick() {
        console.log( 'MHL nbia-date-range: onClearClick' );
        this.dateRangeToDate = null;
        this.dateRangeFromDate = null;
        this.disableUseDateRange = true;
        this.checked = false;
        this.isAllEmpty();
    }

    onApplyCriteriaClick() {
        console.log( 'MHL nbia-date-range: onApplyCriteriaClick' );
    }

    onRemoveCriteriaClick() {
        console.log( 'MHL nbia-large-text-input: onRemoveCriteriaClick' );
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


    // TODO
    onDateChangedTo( e0: IMyDateModel ) {
        console.log( 'MHL 100 onDateChangedTo dateRangeToDate: ', this.dateRangeToDate['year'] + '/' + this.dateRangeToDate['month'] + '/' + this.dateRangeToDate['day'] );


        // We need to do this because "dateChanged" event can happen before the bound variable toDateModel is updated.

        if( !this.utilService.isNullOrUndefined( e0.date ) && (e0.date.year > 0) ){
            this.dateRangeToDate['date'] = e0.date;
        }


        this.validateDateRange();
        this.onApplyCheckboxChange();

    }

    // TODO
    onDateChangedFrom( e1: IMyDateModel ) {
        console.log( 'MHL 102 onDateChangedFrom dateRangeFromDate: ', this.dateRangeFromDate['formatted'] );

        if( !this.utilService.isNullOrUndefined( e1.date ) && (e1.date.year > 0) ){
            this.dateRangeFromDate['date'] = e1.date;
        }

        this.validateDateRange();
        this.onApplyCheckboxChange();

    }

    /**
     * When the user clicks the "Apply" checkbox, add the date criteria to the query.
     * If they are un-checking the "Apply" checkbox, remove the date range from the query.
     *
     */
    onApplyCheckboxChange() {

        let datRangeForQuery;
        if( this.checked ){
            datRangeForQuery = (this.dateRangeFromDate['formatted'] + ',' + this.dateRangeToDate['formatted']).replace( /\//g, '-' );
            // this.updateQuery( datRangeForQuery );
            console.log( 'MHL  this.updateQuery( datRangeForQuery ): ', datRangeForQuery );
        }else{
            //   this.updateQuery( null );
            console.log( 'MHL  this.updateQuery( null )' );
        }
    }

    isAllEmpty() {

        if( !this.utilService.isNullOrUndefined( this.dateRangeFromDate ) && (!this.utilService.isNullOrUndefined( this.dateRangeFromDate['date'] )) ){
            return false;
        }
        if( !this.utilService.isNullOrUndefined( this.dateRangeToDate ) && (!this.utilService.isNullOrUndefined( this.dateRangeToDate['date'] )) ){
            return false;
        }
        return true;
    }

    /**
     * TODO add real range checks...
     */
    validateDateRange() {
        console.log('MHL dynamicQueryCriteriaAllowOneValue: ', this.queryCriteriaData['dynamicQueryCriteriaAllowOneValue']);

        // If either date is empty and dynamicQueryCriteriaAllowOneValue is false
        if( this.queryCriteriaData['dynamicQueryCriteriaAllowOneValue'] ){
            if(
                (this.utilService.isNullOrUndefined( this.dateRangeFromDate ) ||
                    this.utilService.isNullOrUndefined( this.dateRangeFromDate['date'] )) &&
                (this.utilService.isNullOrUndefined( this.dateRangeFromDate ) ||
                    this.utilService.isNullOrUndefined( this.dateRangeFromDate['date'] ))
            ){
                this.disableUseDateRange = true;
                this.checked = false;
                return false;

            }

        }else{
            if(
                this.utilService.isNullOrUndefined( this.dateRangeFromDate ) ||
                this.utilService.isNullOrUndefined( this.dateRangeFromDate['date'] ) ||
                this.utilService.isNullOrUndefined( this.dateRangeFromDate ) ||
                this.utilService.isNullOrUndefined( this.dateRangeFromDate['date'] )
            ){
                this.disableUseDateRange = true;
                this.checked = false;
                return false;

            }
        }

        this.disableUseDateRange = false;
        return true;
    }

}
