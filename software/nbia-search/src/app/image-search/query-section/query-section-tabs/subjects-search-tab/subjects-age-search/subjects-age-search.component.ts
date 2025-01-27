import { Component, OnDestroy, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Consts } from '@app/consts';
import { CommonService } from '@app/image-search/services/common.service';
import { UtilService } from '@app/common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ParameterService } from '@app/common/services/parameter.service';

@Component( {
    selector: 'nbia-subjects-age-search',
    templateUrl: './subjects-age-search.component.html',
    styleUrls: ['../../../../../app.component.scss', '../subjects-search-tab.component.scss', './subjects-age-search.component.scss'],

} )
export class SubjectsAgeSearchComponent implements OnInit, OnDestroy{

    sexRadioLabels = ['All', 'Female', 'Male', 'None'];
    sexApply = false;
    sexApplySelection = 0;
    disabled = false;
    showPatientAgeRangeExplanation = false;
    posY = 0;

    fromPatientAge: number = 0;
    toPatientAgeTrailer: number = 100;
    fromPatientAgeTrailer: number = 0;
    toPatientAge: number = 100;

    nonSpecifiedChecked = false;
    nonSpecifiedCheckedTrailer = false;

    nonAgeChecked = false;
    options: Options = {
        floor: 0,
        ceil: 100,
        step: 1,
        enforceStep: false,
        enforceRange: false,
    };

    /**
     * The list used by the HTML.
     */
    criteriaList;

    /**
     * For hide or show this group of criteria when the arrows next to the heading are clicked.
     */
   //showCriteriaList;
    showPatientAgeRange= false;

    /**
     * Used to clean up subscribes on the way out to prevent memory leak.
     * @type {Subject<boolean>}
     */
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private utilService: UtilService,
                 private initMonitorService: InitMonitorService, private queryUrlService: QueryUrlService,
                 private parameterService: ParameterService ) {
    }

    ngOnInit() {

        //Start with default values
        this.onShowPatientAgeRangeClick(false);

        this.commonService.showPatientAgeRangeExplanationEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showPatientAgeRangeExplanation = <boolean>data;
            }
        );


            // Get persisted PatientAge 
            this.showPatientAgeRange = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_AVAILABLE );
            if( this.utilService.isNullOrUndefined( this.showPatientAgeRange ) ){
                this.showPatientAgeRange = Consts.SHOW_CRITERIA_QUERY_AVAILABLE_DEFAULT;
                this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_AVAILABLE, this.showPatientAgeRange );
            }
    
    
            // Called when the "Clear" button on the left side of the Display query at the top.
            this.commonService.resetAllSimpleSearchEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
                () => {
                  
                    this.totalQueryClear();
                    this.onPatientAgeClearAllClick( );
                    this.queryUrlService.clear( this.queryUrlService.PATIENT_AGE_RANGE );
                }
            );
    
            this.commonService.resetAllSimpleSearchForLoginEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
                () => {
                    this.onPatientAgeClearAllClick();
                    this.queryUrlService.clear( this.queryUrlService.PATIENT_AGE_RANGE );
                } );
    
    
             // Just set the values, not the 'Apply "Available" patient age range'
            this.parameterService.parameterPatientAgeRangeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
                async data => {
                    this.fromPatientAge = Number( data[1] );
                    this.toPatientAge = Number( data[2] );
                    this.nonSpecifiedChecked = false;
                    this.onApplyPatientAgeRangeClick( true );
                    this.commonService.setHaveUserInput( false );
    
                }
            );
    
            // Get persisted showPatientAgeRange value.  Used to show, or collapse this category of criteria in the UI.
            this.showPatientAgeRange = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_PATIENTAGE_DEFAULT );
            if( this.utilService.isNullOrUndefined( this.showPatientAgeRange ) ){
                this.showPatientAgeRange = Consts.SHOW_CRITERIA_QUERY_PATIENTAGE_DEFAULT;
                this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_PATIENTAGE_DEFAULT, this.showPatientAgeRange );
            }
    
            this.initMonitorService.setPatientAgeRangeInit( true );
        }
        
        /**
         * Hides or shows this group of criteria when the arrows next to the heading are clicked.
         *
         * @param show
         */
        onShowPatientAgeRangeClick( show: boolean ) {
            this.showPatientAgeRange = show;
        }
    
         /**
         * Called when the user is totally clearing the complete current query
         */
         totalQueryClear() {
            this.onPatientAgeClearAllClick();
        }
    
        /**
         *
         * @param {boolean} totalClear  true = the user has cleared the complete current query - no need to rerun the query
         */
    
        onPatientAgeClearAllClick() { 
            this.commonService.setHaveUserInput( true );
            this.fromPatientAge = 0;
            this.toPatientAge = 100;
            this.fromPatientAgeTrailer = 0;
            this.toPatientAgeTrailer = 100;
            this.nonSpecifiedCheckedTrailer = false;
    
            this.nonSpecifiedChecked = false;
            this.queryUrlService.clear( this.queryUrlService.PATIENT_AGE_RANGE );
            let patientAgeRangeForQuery: string[] = [];
            patientAgeRangeForQuery[0] = Consts.PATIENT_AGE_RANGE_CRITERIA;
    
            this.commonService.updateQuery( patientAgeRangeForQuery );
            
        }
    
          /**
         * When the user clicks the "Apply" checkbox, add the date criteria to the query.
         *
         * @param checked
         */
          onApplyCheckboxClick( checked ) {
            // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
            this.commonService.setHaveUserInput( true );
    
            this.nonSpecifiedChecked = checked;
            let patientAgeRangeForQuery: string[] = [];
            patientAgeRangeForQuery[0] = Consts.PATIENT_AGE_RANGE_CRITERIA;
            patientAgeRangeForQuery[1] = this.fromPatientAge.toString();
            patientAgeRangeForQuery[2] = this.toPatientAge.toString();
    
    
            if( checked ){
                // From
              //  PatientAgeRangeForQuery[1] = this.makeFormattedDate( this.fromDate );
                // To
             //   PatientAgeRangeForQuery[2] = this.makeFormattedDate( this.toDate );
    
                // Update queryUrlService
              //  this.queryUrlService.update( this.queryUrlService.DATE_RANGE,
              //      this.makeFormattedDate( this.fromDate ) + '-' + this.makeFormattedDate( this.toDate ) );
            }else{
                // Remove dateRange (if any) in the queryUrlService
              //  this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );
            }
            this.commonService.updateQuery( patientAgeRangeForQuery );
        }
    
         /**
         * Updates the query.
         * TODO Rename this, there is no longer a checkbox
         *
         * @param checked
         */
         onApplyPatientAgeRangeClick( checked ) {
            // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
            this.commonService.setHaveUserInput( true );
    
            // Build the query.
            let PatientAgeRangeForQuery: string[] = [];
            PatientAgeRangeForQuery[0] = Consts.PATIENT_AGE_RANGE_CRITERIA;
            // Checked, and the user has selected a range.
            if(checked && (+this.fromPatientAge > 0) || (+this.toPatientAge < 100)){
                let numFromPatientAge = Number( this.fromPatientAge );
                PatientAgeRangeForQuery[1] = numFromPatientAge.toString();
                let numToPatientAge = Number( this.toPatientAge );
                PatientAgeRangeForQuery[2] = numToPatientAge.toString();
    
                // Update queryUrlService  for share my query
                this.queryUrlService.update( this.queryUrlService.PATIENT_AGE_RANGE, this.fromPatientAge + '-' + this.toPatientAge + 'mm' );
            }
            if( ! checked )
            {
                // Remove PatientAgeRange (if any) in the queryUrlService
                this.queryUrlService.clear( this.queryUrlService.PATIENT_AGE_RANGE );
                // If user has unchecked or have changed the event to none ("Select") or has no To AND From values, remove Days from baseline from the query
                PatientAgeRangeForQuery.slice( 0, 1 );
            }
    
            this.toPatientAgeTrailer = this.toPatientAge;
            this.fromPatientAgeTrailer = this.fromPatientAge;
            this.nonSpecifiedCheckedTrailer = this.nonSpecifiedChecked;
            
            this.commonService.updateQuery( PatientAgeRangeForQuery );
    
        }
    
         /**
         * If the user input values have changed, update the query.
         */
         onPatientAgeRangeApply() {
            if( this.toPatientAgeTrailer !== this.toPatientAge ||
                this.fromPatientAgeTrailer !== this.fromPatientAge ||
                this.nonSpecifiedCheckedTrailer !== this.nonSpecifiedChecked ){
    
                this.onApplyPatientAgeRangeClick( true );
            }
        }
    
        onPatientAgeRangeExplanationClick(e) {
            this.showPatientAgeRangeExplanation = true;
            this.posY = e.view.pageYOffset + e.clientY;
        }
    
    
        ngOnDestroy() {
            this.ngUnsubscribe.next();
            this.ngUnsubscribe.complete();
        }
    
}
    
    