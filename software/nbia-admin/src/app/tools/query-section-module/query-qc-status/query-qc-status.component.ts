import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '../../../constants';
import { QuerySectionService } from '../services/query-section.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisplayQueryService } from '../../display-query-module/display-query/display-query.service';

@Component( {
    selector: 'nbia-query-qc-status',
    templateUrl: './query-qc-status.component.html',
    styleUrls: ['./query-qc-status.component.scss', '../left-section/left-section.component.scss']
} )
export class QueryQcStatusComponent implements OnInit, OnDestroy{
    @Input() isTop = true; // This one defaults to the top.
    @Input() currentTool;

    showCriteriaList = false;
    hasChecked = false;
    cBox = [];
    qcStatuses = Consts.QC_STATUSES;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private querySectionService: QuerySectionService, private displayQueryService: DisplayQueryService ) {
    }

    ngOnInit() {
        this.clearCBox();

        this.displayQueryService.clearQuerySectionQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.onQcStatusClearAllClick( );
            } );
    }

    onShowCriteriaListClick( s ) {
        this.showCriteriaList = s;
    }

    onQcStatusClearAllClick(  ) {
        this.clearCBox();
        this.hasChecked = false;
        this.updateQuery();
    }

    onCheckboxClick( i ) {
        this.cBox[i] = !this.cBox[i];
        this.updateHasChecked();
        this.updateQuery();
    }

    updateHasChecked(){
        this.hasChecked = false;
        for( let f = 0; f < this.cBox.length; f++ ){
            if( this.cBox[f] ){
                this.hasChecked = true;
            }
        }
    }

    updateQuery() {
        if( this.hasChecked ){
            this.querySectionService.updateQuery( this.currentTool, Consts.QUERY_CRITERIA_QC_STATUS, this.cBox );
        }else{
            this.querySectionService.updateQuery( this.currentTool, Consts.QUERY_CRITERIA_QC_STATUS, null );
        }
    }


    clearCBox(){
        for( let f = 0; f < this.qcStatuses.length; f++ ){
            this.cBox[f] = false;
        }

    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


}
