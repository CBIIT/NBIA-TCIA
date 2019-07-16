import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonService } from '@app/image-search/services/common.service';
import { UtilService } from '@app/common/services/util.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { takeUntil } from 'rxjs/operators';
import { Consts } from '@app/consts';

@Component( {
    selector: 'nbia-third-party-query',
    templateUrl: './third-party-query.component.html',
    styleUrls: ['../../../../../app.component.scss', '../simple-search.component.scss']
} )
export class ThirdPartyQueryComponent implements OnInit{

    thirdPartyRadioLabels = ['Only 3rd-Party Results', 'Exclude 3rd-Party Results', 'Include 3rd-Party Results'];
    thirdPartyApply = false;
    thirdPartyApplySelection = 2;

    /**
     * The list used by the HTML.
     */
    criteriaList;

    /**
     * For hide or show this group of criteria when the arrows next to the heading are clicked.
     */
    showCriteriaList;

    showThirdPartyExplanation = false;

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
                this.thirdPartyApply = false;
                this.thirdPartyApplySelection = 1;
                this.initMonitorService.setThirdPartyInit( true );
            }
        );

        this.parameterService.parameterThirdPartyEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.thirdPartyApplySelection = (JSON.stringify( data ).toUpperCase() === '"YES"') ? 0 : 1;
                this.onApplyThirdPartyChecked( true );
                this.commonService.setHaveUserInput( false );
            }
        );

        this.commonService.showThirdPartyExplanationEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.showThirdPartyExplanation = <boolean>data;
            }
        );


        // Get persisted showCriteriaList value.  Used to show, or collapse this category of criteria in the UI.
        this.showCriteriaList = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_THIRD_PARTY );
        if( this.utilService.isNullOrUndefined( this.showCriteriaList ) ){
            this.showCriteriaList = Consts.SHOW_CRITERIA_QUERY_THIRD_PARTY_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_THIRD_PARTY, this.showCriteriaList );
        }

        this.initMonitorService.setThirdPartyInit( true );
    }


    /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param show
     */
    onShowCriteriaListClick( show: boolean ) {
        this.showCriteriaList = show;
        this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_THIRD_PARTY, this.showCriteriaList );
    }

    onThirdPartyRadioChange( value ) {
        this.thirdPartyApplySelection = value;
        if( value === 2){
            this.thirdPartyApply = false;
        }
        else{
            this.thirdPartyApply = true;
        }
        this.onApplyThirdPartyChecked( this.thirdPartyApply );

        if( this.thirdPartyApply ){
            this.onApplyThirdPartyChecked( this.thirdPartyApply );
        }
    }

    onApplyThirdPartyChecked( status ) {
        let criteriaForQuery: string[] = [];
        this.commonService.setHaveUserInput( true );
        this.thirdPartyApply = status;

        // This category's data for the query, the 0th element is always the category name.
        criteriaForQuery.push( Consts.THIRD_PARTY_CRITERIA );
        if( status ){
            let selection = (this.thirdPartyApplySelection === 0) ? 'YES' : 'NO';
            criteriaForQuery.push( selection );
            this.queryUrlService.update( this.queryUrlService.THIRD_PARTY, selection );
        }else{
            this.queryUrlService.clear( this.queryUrlService.THIRD_PARTY );
        }

        this.commonService.updateQuery( criteriaForQuery );

    }

    onThirdPartyExplanationClick(){
        this.showThirdPartyExplanation = true;
    }
}
