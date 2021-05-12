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
    showClinicalTimePointsExplanation = false;

    fromBaseLineFrom = '';
    fromBaseLineFromHold = '';
    fromBaseLineFromTrailer = '';
    displayFromBaseLineFrom = '';
    fromBaseLineTo = '';
    fromBaseLineToHold = '';
    fromBaseLineToTrailer = '';
    displayFromBaseLineTo = '';
    eventTypeList = [];
    errorFlag = false;
    currentEventTypeIndex = 0;
    currentEventTypeTrailer = 0;
    minMaxTimePoints;
    searchResultsMinMaxTimePoints = {};
    searchResultsMinMaxTimePointsOrig = {};
    showClinicalTimepoints = true;
    resultsCount = -1;

    tempTest0 = 0;
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
                this.searchResultsMinMaxTimePoints = <any>data;
                this.searchResultsMinMaxTimePointsOrig = <any>data;
                this.buildDropDownList();
                // Set the values that are displayed under the user input boxes
                this.updateDisplayMinMax();
            }
        );
        this.getInitialMinMaxTimePoints();


        this.commonService.showClinicalTimePointsExplanationEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showClinicalTimePointsExplanation = <boolean>data;
            }
        );


        // Every time a new query returns results.
        this.apiServerService.simpleSearchTimePointsMinMaxEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.searchResultsMinMaxTimePoints = <any>data;
                this.updateDisplayMinMax();
            }
        );

        // Called when the "Clear" button on the left side of the Display query at the top.
        this.commonService.resetAllSimpleSearchEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.onClinicalTimepointsClearAllClick();
            }
        );

        // This will receive -1 if there is now no query, need to treat this same as "clear" or start state.
        this.commonService.searchResultsCountEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.resultsCount = <any>data;
                //  if( data === -1 || data === 0 ){
                if( data === -1 ){
                    this.getInitialMinMaxTimePoints();
                }
            } );

        this.commonService.resetAllSimpleSearchForLoginEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.getInitialMinMaxTimePoints();
                this.onClinicalTimepointsClearAllClick();
            } );

        // Used when there are query parameters in the URL.
        this.parameterService.parameterDaysFromBaselineEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async data => {
                // Make sure we have the list of events before moving forward.
                while( this.eventTypeList.length < 1 ){
                    await this.commonService.sleep( Consts.waitTime );
                }

                let dateString = <string>data;
                let to = dateString;
                let from = dateString;
                let event = dateString;

                if( dateString.includes( '--' ) ){
                    to = to.replace( /.*--/, '-' );
                }else{
                    to = to.replace( /.*-/, '' );
                }


                from = from.replace( /^.*:/, '' )
                if( from.indexOf( '-' ) > 0 ){
                    from = from.replace( /-.*/, '' );
                }else{
                    from = from.slice( 1 );
                    from = '-' + from.replace( /-.*/, '' );
                }
                event = event.replace( /:.*/, '' );

                this.fromBaseLineFrom = from;
                this.fromBaseLineFromTrailer = from;
                this.fromBaseLineTo = to;
                this.fromBaseLineFromTrailer = to;
                this.fromBaseLineToTrailer = to;
                this.currentEventTypeIndex = this.getEventIndexByName( event );
                this.currentEventTypeTrailer = this.currentEventTypeIndex;
                this.onApplyFromBaselineCheckboxClick( true );
                this.commonService.setHaveUserInput( false );
            }
        );

        this.initFilters();
        this.initMonitorService.setDaysFromBaselineInit( true );

    }

    async initFilters() {

        // This wait will make give the html elements time to "exist"
        while( this.utilService.isEmpty( this.eventTypeList ) ){
            await this.commonService.sleep( Consts.waitTime );
        }
        this.utilService.setInputFilter( document.getElementById( 'fromBaseLineFromIntTextBox' ), function( value ) {
            return /^-?\d*$/.test( value );
        } );
        this.utilService.setInputFilter( document.getElementById( 'fromBaseLineToIntTextBox' ), function( value ) {
            return /^-?\d*$/.test( value );
        } );

    }


    onShowClinicalTimepointsClick( state ) {
        this.showClinicalTimepoints = state;
    }

    onClinicalTimepointsClearAllClick() {
        this.fromBaseLineFrom = '';
        this.fromBaseLineFromTrailer = '';
        this.displayFromBaseLineFrom = '';
        this.fromBaseLineFromHold = '';

        this.fromBaseLineTo = '';
        this.fromBaseLineToTrailer = '';
        this.displayFromBaseLineTo = '';
        this.fromBaseLineToHold = '';

        this.currentEventTypeIndex = 0;
        this.currentEventTypeTrailer = 0;
    }

    /**
     * Set the values that are displayed under the user input boxes.
     */
    updateDisplayMinMax() {
        this.displayFromBaseLineFrom = this.getMinByEvent( this.eventTypeList[this.currentEventTypeIndex] );
        this.displayFromBaseLineTo = this.getMaxByEvent( this.eventTypeList[this.currentEventTypeIndex] );
    }

    /**
     * If the user input values have changed, update the query.
     */
    onDaysFromBaseLineApply() {
        if( this.fromBaseLineFromTrailer !== this.fromBaseLineFrom ||
            this.fromBaseLineToTrailer !== this.fromBaseLineTo ||
            this.currentEventTypeTrailer !== this.currentEventTypeIndex
        ){
            this.onApplyFromBaselineCheckboxClick( true );
        }
    }

    buildDropDownList() {
        this.eventTypeList = [];
        for( let key in this.searchResultsMinMaxTimePoints['maxTimepoints'] ){
            if( this.searchResultsMinMaxTimePoints['maxTimepoints'].hasOwnProperty( key ) ){
                this.eventTypeList.push( key );
            }
        }

        // Sort
        this.eventTypeList.sort( ( row1, row2 ) => row1.localeCompare( row2 ) );

        // Add the empty one at the top
        this.eventTypeList.unshift( 'none' );
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

    /**
     * Updates the query.
     * TODO Rename this, there is no longer a checkbox
     *
     * @param checked
     */
    onApplyFromBaselineCheckboxClick( checked ) {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );

        // Build the query.
        let daysFromBaselineForQuery: string[] = [];
        daysFromBaselineForQuery[0] = Consts.DAYS_FROM_BASELINE_CRITERIA;
        // Checked, an event is selected, and we have at least To or From input
        if(
            checked && (this.currentEventTypeIndex !== 0) && (this.fromBaseLineFrom !== '-') && (this.fromBaseLineTo !== '-') &&
            ((this.fromBaseLineFrom.length > 0) || (this.fromBaseLineTo.length > 0))
        ){

            // Event Type
            daysFromBaselineForQuery[1] = this.eventTypeList[this.currentEventTypeIndex];

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
        this.fromBaseLineFromTrailer = this.fromBaseLineFrom;
        this.fromBaseLineToTrailer = this.fromBaseLineTo;
        this.currentEventTypeTrailer = this.currentEventTypeIndex;

        this.commonService.updateQuery( daysFromBaselineForQuery );

    }

    onEventTypeDropdownClick( i ) {
        if( i === 0 ){
            this.currentEventTypeIndex = i;
            return
        }

        if( (this.getMinByEvent( this.eventTypeList[i] ) === '') &&
            (this.getMaxByEvent( this.eventTypeList[i] ) === '')
        ){
            return;
        }


        this.currentEventTypeIndex = i;
        this.displayFromBaseLineFrom = this.getMinByEvent( this.eventTypeList[i] );
        this.displayFromBaseLineTo = this.getMaxByEvent( this.eventTypeList[i] );

        // this.onApplyFromBaselineCheckboxClick( true );
        this.currentEventTypeTrailer = this.eventTypeList[i];
        // If no event is selected
        if( this.currentEventTypeIndex === 0 ){
            this.onApplyFromBaselineCheckboxClick( false );
            this.currentEventTypeTrailer = 0;
        }
    }

    onClinicalTimePointsExplanationClick(){
        this.showClinicalTimePointsExplanation = true;
    }

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
        if( this.searchResultsMinMaxTimePoints['minTimepoints'] === null ){
            return '';
        }
        let val = this.searchResultsMinMaxTimePoints['minTimepoints'][event];
        if( val !== undefined ){
            return val;
        }
        return '';
    }

    getMaxByEvent( event ) {
        if( this.searchResultsMinMaxTimePoints['maxTimepoints'] === null ){
            return '';
        }
        let val = this.searchResultsMinMaxTimePoints['maxTimepoints'][event];
        if( val !== undefined ){
            return val;
        }
        return '';
    }

    onBaseLineFromChange() {
        if( !/^-?\d*$/.test( this.fromBaseLineFrom ) ){
            this.fromBaseLineFrom = this.fromBaseLineFromHold;
        }
        this.fromBaseLineFromHold = this.fromBaseLineFrom;
    }

    onBaseLineToChange() {
        if( !/^-?\d*$/.test( this.fromBaseLineTo ) ){
            this.fromBaseLineTo = this.fromBaseLineToHold;
        }
        this.fromBaseLineFromHold = this.fromBaseLineTo;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
