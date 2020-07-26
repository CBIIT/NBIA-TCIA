import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { UtilService } from '@app/common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { Consts } from '@app/consts';
import { Subject } from 'rxjs';

@Component( {
    selector: 'nbia-days-from-baseline',
    templateUrl: './days-from-baseline.component.html',
    styleUrls: ['../simple-search.component.scss', './days-from-baseline.component.scss']
} )
export class DaysFromBaselineComponent implements OnInit, OnDestroy{

    fromBaseLineFrom = '';
    displayFromBaseLineFrom = '';
    fromBaseLineTo = '';
    displayFromBaseLineTo = '';
    eventTypeList = [];
    errorFlag = false;
    currentEventTypeIndex = 0;
    currentEventTypeTrailer = '';
    daysFromBaseLineApply = false;
    minMaxTimePoints;
    searchResultsMaxTimePoints = {};

    /**
     * Used to clean up subscribes on the way out to prevent memory leak.
     * @type {Subject<boolean>}
     */
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private parameterService: ParameterService,
                 private initMonitorService: InitMonitorService, private queryUrlService: QueryUrlService,
                 private apiServerService: ApiServerService, private utilService: UtilService ) {

    }

    ngOnInit() {

        // Get initial values before any query is run.
        this.apiServerService.getMinMaxTimepointsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.searchResultsMaxTimePoints = <any>data;
                this.buildDropDownList();
            }
        );
        this.getInitialMinMaxTimePoints();


        // Every time a new query returns results.
        this.apiServerService.simpleSearchTimePointsMinMaxEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.searchResultsMaxTimePoints = <any>data;
                this.buildDropDownList();
            }
        );

        // Called when the "Clear" button on the left side of the Display query at the top.
        this.commonService.resetAllSimpleSearchEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.fromBaseLineFrom = '';
                this.fromBaseLineTo = '';
                this.currentEventTypeIndex = 0;
                this.daysFromBaseLineApply = false;

                this.initMonitorService.setExcludeCommercialInit( true );
                this.getInitialMinMaxTimePoints();
                this.currentEventTypeIndex = 0;

            }
        );

        // This will receive -1 if there is now no query, need to treat this same as "clear" or start state.
        this.commonService.searchResultsCountEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( data === -1 ){
                    this.getInitialMinMaxTimePoints();
                }
            } );

        // Used when there are query parameters in the URL.
        this.parameterService.parameterDaysFromBaselineEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async data => {
                // Make sure we have the list of events before moving forward.
                while( this.eventTypeList.length < 1 ){
                    await this.commonService.sleep( Consts.waitTime );
                }


                let to = <string>data;
                let from = <string>data;
                let event = <string>data;

                to = to.replace( /.*-/, '' );
                from = from.replace( /^.*:/, '' ).replace( /-.*/, '' );
                event = event.replace( /:.*/, '' );
                this.fromBaseLineFrom = from;
                this.fromBaseLineTo = to;
                this.currentEventTypeIndex = this.getEventIndexByName( event );
                this.currentEventTypeTrailer = event;
                this.daysFromBaseLineApply = true;
                this.onApplyFromBaselineCheckboxClick( true );

                this.commonService.setHaveUserInput( false );
            }
        );
        /*

                // TODO We won't be using this
                this.apiServerService.getEventTypesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
                    data => {
                        this.eventTypeList = <any>data;
                        this.eventTypeList.unshift( 'Select' );
                    }
                );

                // React to errors
                this.apiServerService.getEventTypesErrorEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
                    ( err ) => {
                        // TODO these errors need to be vetted, some are harmless, and shouldn't interrupt the UI flow
                        console.log( 'MHL error: ', err );
                        alert( 'error: ' + err['message'] );
                        this.errorFlag = true;
                    }
                );

        */
        //   this.apiServerService.dataGet( 'getEventTypes', '' );

        //   this.testForList();

        this.utilService.setInputFilter( document.getElementById( 'fromBaseLineFromIntTextBox' ), function( value ) {
            return /^-?\d*$/.test( value );
        } );
        this.utilService.setInputFilter( document.getElementById( 'fromBaseLineToIntTextBox' ), function( value ) {
            return /^-?\d*$/.test( value );
        } );

        this.initMonitorService.setDaysFromBaselineInit( true );

    }

    async testForList() {  // TODO - this is only for testing, delete eventually
        console.log( 'MHL IN testForList' );
        while( this.utilService.isEmpty( this.eventTypeList ) ){
            await this.commonService.sleep( Consts.waitTime );
        }
        console.log( 'MHL GOT: ', this.eventTypeList );
    }

    buildDropDownList() {
        this.eventTypeList = [];
        for( let key in this.searchResultsMaxTimePoints['maxTimepoints'] ){
            if( this.searchResultsMaxTimePoints['maxTimepoints'].hasOwnProperty( key ) ){
                this.eventTypeList.push( key );
            }
        }

        // Sort
        this.eventTypeList.sort( ( row1, row2 ) => row1.localeCompare( row2 ) );

        // Add the empty one at the top
        this.eventTypeList.unshift( 'select' );

        // See if there is a previous event that we should try to select.
        let i = this.getEventIndexByName( this.currentEventTypeTrailer );
        if( i > 0 ){
            this.currentEventTypeIndex = i;
        }else{
            this.currentEventTypeIndex = 0;
        }
    }

    getInitialMinMaxTimePoints() {
        // The call to trigger populating this.descriptions (above), and wait for the results.
        this.apiServerService.dataGet( Consts.GET_MIN_MAX_TIME_POINTS, '' );
    }

    getEventIndexByName( eventName ) {
        eventName = eventName.toUpperCase();
        for( let f = 0; f < this.eventTypeList.length; f++ ){
            if( this.eventTypeList[f].toUpperCase() === eventName ){
                return f;
            }
        }
        return -1;
    }

    onApplyFromBaselineCheckboxClick( checked ) {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );

        let daysFromBaselineForQuery: string[] = [];
        daysFromBaselineForQuery[0] = Consts.DAYS_FROM_BASELINE_CRITERIA;

        // Checked, an event is selected, and we have at least To or From input
        if( checked && this.currentEventTypeIndex !== 0 && ((this.fromBaseLineFrom.length > 0) || (this.fromBaseLineTo.length > 0)) ){

            // Event Type
            let eventType = this.eventTypeList[this.currentEventTypeIndex];
            daysFromBaselineForQuery[1] = eventType;

            // From
            if( this.fromBaseLineFrom.length > 0 ){
                let numFromBaseLineFrom = Number( this.fromBaseLineFrom );
                daysFromBaselineForQuery[2] = numFromBaseLineFrom.toString();
            }else{
                daysFromBaselineForQuery[2] = '';
            }

            // To
            if( this.fromBaseLineTo.length > 0 ){
                let numFromBaseLineTo = Number( this.fromBaseLineTo );
                daysFromBaselineForQuery[3] = numFromBaseLineTo.toString();
            }else{
                daysFromBaselineForQuery[3] = '';
            }

            // Update queryUrlService  for share my query
            this.queryUrlService.update( this.queryUrlService.DAYS_FROM_BASELINE, this.eventTypeList[this.currentEventTypeIndex] + ':' + this.fromBaseLineFrom + '-' + this.fromBaseLineTo );

            // If this was called with URL parameters we need to set the range text.
            this.displayFromBaseLineFrom = this.getMinByEvent( this.eventTypeList[this.currentEventTypeIndex] );
            this.displayFromBaseLineTo = this.getMaxByEvent( this.eventTypeList[this.currentEventTypeIndex] );

        }else{
            // Remove daysFromBaseline (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.DAYS_FROM_BASELINE );

            // If user has unchecked or have changed the event to none ("Select") or has no To AND From values, remove Days from baseline from the query
            daysFromBaselineForQuery.slice( 0, 1 );

        }
        this.commonService.updateQuery( daysFromBaselineForQuery );

    }

    onEventTypeDropdownClick( i ) {

        this.currentEventTypeIndex = i;
        this.currentEventTypeTrailer = this.eventTypeList[i];
        this.displayFromBaseLineFrom = this.getMinByEvent( this.eventTypeList[i] );
        this.displayFromBaseLineTo = this.getMaxByEvent( this.eventTypeList[i] );

        if( this.daysFromBaseLineApply && (this.currentEventTypeIndex > 0) ){
            this.onApplyFromBaselineCheckboxClick( true );
        }
        // If no event is selected
        if( this.daysFromBaseLineApply && (this.currentEventTypeIndex === 0) ){
            this.onApplyFromBaselineCheckboxClick( false );
            this.currentEventTypeTrailer = '';
        }
    }

    /**
     */

    /**
     * Get the dropdown index of an event by it's name.
     * This will be used when we try to keep the same event selected after the list has change.
     *
     * @param eventName
     */
    setCurrentEventTypeIndexByName( eventName ): number {
        for( let i = 0; i < this.eventTypeList.length; i++ ){
            if( eventName === this.eventTypeList[i] ){
                return i;
            }
        }
        return -1;
    }


    getMinByEvent( event ) {
        let val = this.searchResultsMaxTimePoints['minTimepoints'][event];
        if( val !== undefined ){
            return val;
        }
        return '';
    }

    getMaxByEvent( event ) {
        let val = this.searchResultsMaxTimePoints['maxTimepoints'][event];
        if( val !== undefined ){
            return val;
        }
        return '';
    }

    onBaseLineFromChange() {
        if( this.daysFromBaseLineApply ){
            this.onApplyFromBaselineCheckboxClick( true );
        }
    }

    onBaseLineToChange() {
        if( this.daysFromBaseLineApply ){
            this.onApplyFromBaselineCheckboxClick( true );
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
