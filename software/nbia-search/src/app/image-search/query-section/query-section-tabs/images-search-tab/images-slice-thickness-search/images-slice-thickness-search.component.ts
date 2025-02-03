import { Component, OnDestroy, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Consts } from '@app/consts';
import { CommonService } from '@app/image-search/services/common.service';
import { UtilService } from '@app/common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';

@Component( {
    selector: 'nbia-images-slice-thickness-search',
    templateUrl: './images-slice-thickness-search.component.html',
    styleUrls: ['../../../../../app.component.scss', '../images-search-tab.component.scss', './images-slice-thickness-search.component.scss'],

} )
export class ImagesSliceThicknessSearchComponent implements OnInit, OnDestroy{

    showSliceThicknessRangeExplanation = false;
    posY = 0;

    sliceThicknessSelection = 0;
    fromSliceThickness: number = 0;
    toSliceThicknessTrailer: number = 1800.0;
    fromSliceThicknessTrailer: number = 1;
    toSliceThickness: number = 1800.0;
    disabled = false;
    options: Options = {
        floor: 0,
        ceil: 1800.0,
        step: 0.5,
        enforceStep: false,
        enforceRange: false,
    };

    resultsCount = -1;

    /**
     * The list used by the HTML.
     */
    criteriaList;

    /**
     * For hide or show this group of criteria when the arrows next to the heading are clicked.
     */
    showSliceThicknessRange = false;

    /**
     * Used to clean up subscribes on the way out to prevent memory leak.
     * @type {Subject<boolean>}
     */
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private utilService: UtilService,
                 private initMonitorService: InitMonitorService, private queryUrlService: QueryUrlService,
                 private apiServerService: ApiServerService, private parameterService: ParameterService ) {
    }

    ngOnInit() {

        //Start with default values
        this.onShowSlickThicknessRangeClick(false);

        this.commonService.showSliceThicknessRangeExplanationEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showSliceThicknessRangeExplanation = <boolean>data;
            }
        );


        // Get persisted showSliceThicknessRange 
        this.showSliceThicknessRange  = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_SLICE_THICKNESS );
        if( this.utilService.isNullOrUndefined( this.showSliceThicknessRange  ) ){
            this.showSliceThicknessRange  = Consts.SHOW_CRITERIA_QUERY_SLICE_THICKNESS_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_SLICE_THICKNESS, this.showSliceThicknessRange  );
        }


        // Called when the "Clear" button on the left side of the Display query at the top.
        this.commonService.resetAllSimpleSearchEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.fromSliceThickness = 0;
                this.toSliceThickness = 1800.0;
                this.fromSliceThicknessTrailer = 1; 
                this.toSliceThicknessTrailer = 1800.0;
                this.queryUrlService.clear( this.queryUrlService.SLICE_THICKNESS );
            }
        );

        this.commonService.resetAllSimpleSearchForLoginEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.fromSliceThickness = 0;
                this.toSliceThickness = 1800.0;
                this.fromSliceThicknessTrailer = 1; 
                this.toSliceThicknessTrailer = 1800.0;
                this.queryUrlService.clear( this.queryUrlService.SLICE_THICKNESS );
            } );

         // Just set the values of slice thickness range from URL parameter, not the 'Apply slice thickness range
        this.parameterService.parameterSliceThicknessRangeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async data => {
                try {
                    let dataString = <string>data; //sample data: SliceThicknessCriteria=0-13mm
                    let dataArray = dataString.replace('--','-').replace('mm','').split( '-' );
                    if (dataArray && dataArray.length > 1) {
                        this.fromSliceThickness = Number(dataArray[0]);
                        this.toSliceThickness = Number(dataArray[1]);
                        if (!isNaN(this.fromSliceThickness) && !isNaN(this.toSliceThickness)) {
                            this.onApplySliceThicknessRangeClick(true);
                            this.showSliceThicknessRange = true;
                            this.commonService.setHaveUserInput(false);
                        } else {
                            console.error("Invalid slice thickness values:", dataString);
                        }
                    } else {
                        console.warn("Unexpected slice thickness format:", dataString);
                    }
                } catch (error) {
                    console.error("Error processing slice thickness range:", error);
                }
            }
        );


        // Get persisted showSliceThicknessRange  value.  Used to show, or collapse this category of criteria in the UI.
        this.showSliceThicknessRange  = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_SLICE_THICKNESS_DEFAULT );
        if( this.utilService.isNullOrUndefined( this.showSliceThicknessRange  ) ){
            this.showSliceThicknessRange  = Consts.SHOW_CRITERIA_QUERY_SLICE_THICKNESS_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_SLICE_THICKNESS, this.showSliceThicknessRange  );
        }

        this.initMonitorService.setSliceThicknessRangeInit( true );
    }


    /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param show
     */
    onShowSlickThicknessRangeClick( show: boolean ) {
        this.showSliceThicknessRange  = show;
    }

    /**
     *
     * @param {boolean} totalClear  true = the user has cleared the complete current query - no need to rerun the query
     */

    onSliceThicknessClearAllClick() { 
        this.commonService.setHaveUserInput( true );
        this.fromSliceThickness = 0;
        this.toSliceThickness = 1800.0;
        this.fromSliceThicknessTrailer = 1; // the init value is different to keep the apply button active
        this.toSliceThicknessTrailer = 1800.0;
        this.queryUrlService.clear( this.queryUrlService.SLICE_THICKNESS );
        let sliceThicknessRangeForQuery: string[] = [];
        sliceThicknessRangeForQuery[0] = Consts.SLICE_THICKNESS_RANGE_CRITERIA;
        this.commonService.updateQuery( sliceThicknessRangeForQuery );
    }


     /**
     * Updates the query.
     * TODO Rename this, there is no longer a checkbox
     *
     * @param checked
     */
     onApplySliceThicknessRangeClick( checked ) {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );

        // Build the query.
        let sliceThicknessRangeForQuery: string[] = [];
        sliceThicknessRangeForQuery[0] = Consts.SLICE_THICKNESS_RANGE_CRITERIA;
        // Checked, and the user has selected a range.
        if(checked && (+this.fromSliceThickness > 0) || (+this.toSliceThickness < 1800)){
            let numFromSliceThickness = Number( this.fromSliceThickness );
            sliceThicknessRangeForQuery[1] = numFromSliceThickness.toString();
            let numToSliceThickness = Number( this.toSliceThickness );
            sliceThicknessRangeForQuery[2] = numToSliceThickness.toString();

            // Update queryUrlService  for share my query
            this.queryUrlService.update( this.queryUrlService.SLICE_THICKNESS, this.fromSliceThickness + '-' + this.toSliceThickness + 'mm' );
        }
        if( ! checked )
        {
            // Remove sliceThicknessRange (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.SLICE_THICKNESS );
            // If user has unchecked or have changed the event to none ("Select") or has no To AND From values, remove Days from baseline from the query
            sliceThicknessRangeForQuery.slice( 0, 1 );
        }

        this.toSliceThicknessTrailer = this.toSliceThickness;
        this.fromSliceThicknessTrailer = this.fromSliceThickness;
        
        this.commonService.updateQuery( sliceThicknessRangeForQuery );

    }

     /**
     * If the user input values have changed, update the query.
     */
     onSliceThicknessRangeApply() {
        if( this.toSliceThicknessTrailer !== this.toSliceThickness ||
            this.fromSliceThicknessTrailer !== this.fromSliceThickness ){

            this.onApplySliceThicknessRangeClick( true );
        }
    }

    onSliceThicknessRangeExplanationClick(e) {
        this.showSliceThicknessRangeExplanation = true;
        this.posY = e.view.pageYOffset + e.clientY;
    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}

