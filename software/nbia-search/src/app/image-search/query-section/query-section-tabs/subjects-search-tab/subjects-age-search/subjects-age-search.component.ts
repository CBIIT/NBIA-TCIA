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

    showPatientAgeRangeExplanation = false;
    posY = 0;

    fromPatientAge: number = 0;
    toPatientAgeTrailer: number = 100;
    fromPatientAgeTrailer: number = 1; // the init value is different to keep the apply button active
    toPatientAge: number = 100;

    nonAgeChecked = false;
    options: Options = {
        floor: 0,
        ceil: 100,
        step: 1,
        enforceStep: false,
        enforceRange: false,
    };

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
        this.showPatientAgeRange = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_PATIENTAGE );
        if( this.utilService.isNullOrUndefined( this.showPatientAgeRange ) ){
            this.showPatientAgeRange = Consts.SHOW_CRITERIA_QUERY_PATIENTAGE_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_PATIENTAGE, this.showPatientAgeRange );
        }
    
    
        // Called when the "Clear" button on the left side of the Display query at the top.
        this.commonService.resetAllSimpleSearchEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.setInitValues();
                this.queryUrlService.clear( this.queryUrlService.PATIENT_AGE_RANGE );
            }
        );
    

         // Reload the list of search criteria because a user has logged in,
        // they may have different access to available search criteria.    
        this.commonService.resetAllSimpleSearchForLoginEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.setInitValues();
                this.queryUrlService.clear( this.queryUrlService.PATIENT_AGE_RANGE );
            } );


        // Just set the values, not the 'Apply patient age range'
        this.parameterService.parameterPatientAgeRangeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async data => {
                try {
                    let dataString = <string>data; //sample data: PatientAgeRangeCriteria=41-100
                    let dataArray = dataString.match(/(\d+)-(\d+)/);
                    if (dataArray && dataArray.length > 1) {
                        this.fromPatientAge = Number(dataArray[1]); // match results start at index 1 (0 is the serach expression)
                        this.toPatientAge = Number(dataArray[2]);
                
                        if (!isNaN(this.fromPatientAge) && !isNaN(this.toPatientAge)) {
                            this.onApplyPatientAgeRangeClick(true);
                            this.showPatientAgeRange = true;
                            this.commonService.setHaveUserInput(false);
                        } else {
                            console.error("Invalid patient age values:", dataString);
                        }
                    } else {
                        console.warn("Unexpected patient age format:", dataString);
                    }
                } catch (error) {
                    console.error("Error processing patient age range:", error);
                }
            }
        );

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

    setInitValues() {
        this.commonService.setHaveUserInput( true );
        this.fromPatientAge = 0;
        this.toPatientAge = 100;
        this.fromPatientAgeTrailer = 1;
        this.toPatientAgeTrailer = 100;
    }

    onPatientAgeClearAllClick(totalClear: boolean = false) { 
        this.setInitValues();
        this.queryUrlService.clear( this.queryUrlService.PATIENT_AGE_RANGE );
        let patientAgeRangeForQuery: string[] = [];
        patientAgeRangeForQuery[0] = Consts.PATIENT_AGE_RANGE_CRITERIA;
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
            this.queryUrlService.update( this.queryUrlService.PATIENT_AGE_RANGE, this.fromPatientAge + '-' + this.toPatientAge );
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
        this.commonService.updateQuery( PatientAgeRangeForQuery );

    }

        /**
     * If the user input values have changed, update the query.
     */
        onPatientAgeRangeApply() {
        if( this.toPatientAgeTrailer !== this.toPatientAge ||
            this.fromPatientAgeTrailer !== this.fromPatientAge){

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
    
    
