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

    nonAgeChecked = false;
    minValue: number = 0;
    maxValue: number = 100;
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
    showCriteriaList;

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


        // Called when the "Clear" button on the left side of the Display query at the top.
        this.commonService.resetAllSimpleSearchEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.sexApply = false;
                this.sexApplySelection = 2;
                this.nonAgeChecked = false;
                this.initMonitorService.setSexInit( true );
            }
        );

        this.parameterService.parameterPatientSexEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.sexApplySelection = Number( data );
                this.onApplySexApplyChecked( true )
                this.commonService.setHaveUserInput( false );

            }
        );

        // Get persisted showCriteriaList value.  Used to show, or collapse this category of criteria in the UI.
        this.showCriteriaList = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_PATIENTSEX_DEFAULT );
        if( this.utilService.isNullOrUndefined( this.showCriteriaList ) ){
            this.showCriteriaList = Consts.SHOW_CRITERIA_QUERY_PATIENTSEX_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_PATIENTSEX, this.showCriteriaList );
        }

        this.initMonitorService.setSexInit( true );
    }


    /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param show
     */
    onShowCriteriaListClick( show: boolean ) {
        this.showCriteriaList = show;
        this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_PATIENTSEX, this.showCriteriaList );
    }

    onSexRadioChange( value ) {
        this.sexApplySelection = value;
        if( value === 2 ){
            this.sexApply = false;
        }else{
            this.sexApply = true;
        }
        this.onApplySexApplyChecked( this.sexApply );
    }

    onApplySexApplyChecked( status ) {
        let criteriaForQuery: string[] = [];
        this.commonService.setHaveUserInput( true );
        this.sexApply = status;

        // This category's data for the query, the 0th element is always the category name.
        criteriaForQuery.push( Consts.PATIENTSEX_CRITERIA );
        if( status ){
            criteriaForQuery.push( this.sexApplySelection.toString() );
            this.queryUrlService.update( this.queryUrlService.PATIENT_SEX, this.sexApplySelection );
        }else{
            this.queryUrlService.clear( this.queryUrlService.PATIENT_SEX );
        }
        this.commonService.updateQuery( criteriaForQuery );
    }

    patientAgeClearAllClick(totalClear: boolean) { 
        this.commonService.setHaveUserInput( true );
        this.minValue = 0;
        this.maxValue = 100;
        this.nonAgeChecked = false;
       
       // this.checkedCount = 0;
       // this.apiServerService.refreshCriteriaCounts();

        if( !totalClear ){
            let criteriaForQuery: string[] = [];
            criteriaForQuery.push( Consts.IMAGE_MODALITY_CRITERIA );

            // Tells SearchResultsTableComponent that the query has changed,
            // SearchResultsTableComponent will (re)run the query &
            // send updated query to the Query display at the top of the Search results section.
            this.commonService.updateQuery( criteriaForQuery );
           // this.criteriaForQueryHold = [];
        }

        this.queryUrlService.clear( this.queryUrlService.IMAGE_MODALITY );

        // Restore original criteria list and counts.
       // this.completeCriteriaList = this.utilService.copyCriteriaObjectArray( this.completeCriteriaListHold );
        //this.updateCriteriaList( true );
    }

         /**
     * When the user clicks the "Apply" checkbox, add the date criteria to the query.
     *
     * @param checked
     */
    onApplyCheckboxClick( checked ) {
            // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
            this.commonService.setHaveUserInput( true );
    
            this.nonAgeChecked = checked;
            let datRangeForQuery: string[] = [];
            datRangeForQuery[0] = 'DateRangeCriteria';
    
            if( checked ){
                // From
              //  datRangeForQuery[1] = this.makeFormattedDate( this.fromDate );
                // To
             //   datRangeForQuery[2] = this.makeFormattedDate( this.toDate );
    
                // Update queryUrlService
              //  this.queryUrlService.update( this.queryUrlService.DATE_RANGE,
              //      this.makeFormattedDate( this.fromDate ) + '-' + this.makeFormattedDate( this.toDate ) );
            }else{
                // Remove dateRange (if any) in the queryUrlService
              //  this.queryUrlService.clear( this.queryUrlService.DATE_RANGE );
            }
            this.commonService.updateQuery( datRangeForQuery );
        }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
