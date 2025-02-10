import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { ApiServerService } from '../../../../services/api-server.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { Consts } from '@app/consts';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-minimum-matched-studies',
    templateUrl: './minimum-matched-studies.component.html',
    styleUrls: ['../simple-search.component.scss', './minimum-matched-studies.component.scss']
} )
export class MinimumMatchedStudiesComponent implements OnInit, OnDestroy{

    showMinimumMatchedStudiesExplanation = false;
    posY = 0;

    showMinimumMatchedStudies = true;

    matchedTypeRadioLabels = ['Study UID', 'Study Time Point'];
    matchedTypeApply = false;
    matchedTypeApplySelection = 0;


    /**
     * Used in code, and HTML.  Default start value is one.
     *
     * @type {number}
     */
    minNumberOfPoints = 1;

    toolTipText = 'Search results will show only subjects with at least this many studies (time points) or UIDs.';

    noQuery = true;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private apiService: ApiServerService,
                 private parameterService: ParameterService, private initMonitorService: InitMonitorService,
                 private queryUrlService: QueryUrlService, private apiServerService: ApiServerService ) {


        // Set starting value.
        this.commonService.setMinimumMatchedStudiesValue(this.minNumberOfPoints.toString() + (this.matchedTypeApplySelection === 0 ? Consts.MIMUMUM_MATCHED_STUDIES_TYPE_DEFAULT :Consts.MIMUMUM_MATCHED_STUDIES_TYPE_DATE) );
    }

    ngOnInit() {

        this.onChangeMinimumMatchedStudies(); // Default: minNumberOfPoints = 1

        // Used when the Clear button is clicked in the Display Query
        this.commonService.resetAllSimpleSearchEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            () => {
                this.minNumberOfPoints = 1;
                this.matchedTypeApplySelection = 0;
                this.onChangeMinimumMatchedStudies( false );
                this.commonService.emitSimpleSearchQueryForDisplay( [] );
            }
        );


        this.parameterService.parameterMinimumStudiesEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                const pattern = new RegExp(`^(\\d+)(${Consts.MIMUMUM_MATCHED_STUDIES_TYPE_DEFAULT}|${Consts.MIMUMUM_MATCHED_STUDIES_TYPE_DATE})$`);
                const match = String(data).match(pattern);
                if(!match){
                    console.log(`Invalid format: "${data}". Expected format: "X-Dates" or "X-UIDs" where X is a number.`);
                }else{
                    let msCount =  parseInt(match[1], 10);
                    this.minNumberOfPoints = msCount;
                    this.matchedTypeApplySelection = match[2] === Consts.MIMUMUM_MATCHED_STUDIES_TYPE_DEFAULT ? 0 : 1;
                }
               
                this.commonService.setMinimumMatchedStudiesValue(String(data));
                this.commonService.setHaveUserInput( false );
                this.showMinimumMatchedStudies = true ;

            }
        );


        this.commonService.showMinimumMatchedStudiesExplanationEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showMinimumMatchedStudiesExplanation = <boolean>data;
            }
        );


        this.commonService.searchResultsCountEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                if( data === -1 ){ // disable
                    this.noQuery = true;
                    this.minNumberOfPoints = 1;
                    this.matchedTypeApplySelection = 0;
                }
                else{
                    this.noQuery = false;
                }
            }
        );


        // This will tell the parameter service that it can now send us any query criteria that where passed in the URL
        this.initMonitorService.setMinimumStudiesInit( true );

    }

    /**
     * Called when the value of the UI "Number spinner" changes.
     */
    onChangeMinimumMatchedStudies( runQuery = true ) {
        if( this.minNumberOfPoints < 1 ){
            this.minNumberOfPoints = 1;
        }
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false,
        // this method is by user action only, so set setHaveUserInput to true.
        this.commonService.setHaveUserInput( true );
        const criteriaValue = this.minNumberOfPoints.toString() +  (this.matchedTypeApplySelection === 0 ? Consts.MIMUMUM_MATCHED_STUDIES_TYPE_DEFAULT  : Consts.MIMUMUM_MATCHED_STUDIES_TYPE_DATE ) ; 

        this.commonService.setMinimumMatchedStudiesValue(criteriaValue );
        this.queryUrlService.update( this.queryUrlService.MIN_STUDIES, criteriaValue );

        //////////////////////////////////////////////////

        this.apiServerService.getCriteriaCounts();

        //////////////////////////////////////////////////
        let criteriaForQuery: string[] = [];
        criteriaForQuery.push( Consts.MINIMUM_STUDIES );
        criteriaForQuery.push( criteriaValue );
        if( runQuery ){
            this.commonService.updateQuery( criteriaForQuery );
        }
    }
    onShowMinimumMatchedStudiesClick( show: boolean ){
        this.showMinimumMatchedStudies = show;
    }

    onMinimumMatchedStudieseExplanationClick(e) {
        this.showMinimumMatchedStudiesExplanation = true;
        this.posY = e.view.pageYOffset + e.clientY;
    }

    onMatchedTypeRadioChange( selection ) {
        this.matchedTypeApplySelection = selection;
        this.onChangeMinimumMatchedStudies();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
