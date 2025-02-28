import { Component, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '@app/consts';
import { CommonService } from '@app/image-search/services/common.service';
import { UtilService } from '@app/common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ParameterService } from '@app/common/services/parameter.service';

@Component( {
    selector: 'nbia-phantom-query',
    templateUrl: './phantom-query.component.html',
    styleUrls: ['../../../../../app.component.scss', '../simple-search.component.scss']
} )
export class PhantomQueryComponent implements OnInit, OnDestroy{

    phantomRadioLabels = ['Include Phantoms', 'Exclude Phantoms', 'Only Phantoms'];
    phantomApply = false;
    phantomApplySelection = 0;

    showPhantomQueryExplanation = false;
    posY = 0;

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
                this.phantomApply = false;
                this.phantomApplySelection = 0;
                this.queryUrlService.clear( this.queryUrlService.PHANTOMS );
            
            }
        );

        this.parameterService.parameterPhantomsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.phantomApplySelection = Number( data );
                this.onApplyPhantomsApplyChecked( true )
                this.commonService.setHaveUserInput( false );

            }
        );

        // Get persisted showCriteriaList value.  Used to show, or collapse this category of criteria in the UI.
        this.showCriteriaList = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_PHANTOMS );
        if( this.utilService.isNullOrUndefined( this.showCriteriaList ) ){
            this.showCriteriaList = Consts.SHOW_CRITERIA_QUERY_PHANTOMS_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_PHANTOMS, this.showCriteriaList );
        }

        this.commonService.showPhantomQueryExplanationEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showPhantomQueryExplanation = <boolean>data;
            }
        );

        this.initMonitorService.setPhantomsInit( true );
    }


    /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param show
     */
    onShowCriteriaListClick( show: boolean ) {
        this.showCriteriaList = show;
        this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_PHANTOMS, this.showCriteriaList );
    }

    onPhantomRadioChange( value ) {
        this.phantomApplySelection = value;
        if( value === 0 ){
            this.phantomApply = false;
        }else{
            this.phantomApply = true;
        }
        this.onApplyPhantomsApplyChecked( this.phantomApply );
    }

    onApplyPhantomsApplyChecked( status ) {
        let criteriaForQuery: string[] = [];
        this.commonService.setHaveUserInput( true );
        this.phantomApply = status;

        // This category's data for the query, the 0th element is always the category name.
        criteriaForQuery.push( Consts.PHANTOMS_CRITERIA );
        if( status ){
            criteriaForQuery.push( this.phantomApplySelection.toString() );
            this.queryUrlService.update( this.queryUrlService.PHANTOMS, this.phantomApplySelection );
        }else{
            this.queryUrlService.clear( this.queryUrlService.PHANTOMS );
        }
        this.commonService.updateQuery( criteriaForQuery );
    }

    onPhantomQueryExplanationClick(e) {
        this.showPhantomQueryExplanation = true;
        this.posY = e.view?.pageYOffset + e.clientY;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
