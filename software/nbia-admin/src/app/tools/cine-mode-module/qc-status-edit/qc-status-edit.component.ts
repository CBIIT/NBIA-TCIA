import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilService } from '@app/admin-common/services/util.service';
import { SearchResultByIndexService } from '@app/tools/search-results-section-module/services/search-result-by-index.service';
import { Consts } from '@app/constants';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-qc-status-edit',
    templateUrl: './qc-status-edit.component.html',
    styleUrls: ['./qc-status-edit.component.scss']
} )
export class QcStatusEditComponent implements OnInit, OnDestroy{

    @Input() collectionSite;
    @Input() seriesData;

    searchResults;
    useBatchNumber = false;
    batchNumber = 1;
    YES = 2;
    NO = 1;
    NO_CHANGE = 0;
    logText = '';
    isComplete = this.NO_CHANGE;
    isReleased = this.NO_CHANGE;
    visible = -1;
    qcStatuses; //  = Consts.QC_STATUSES;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService, private utilService: UtilService,
                 private searchResultByIndexService: SearchResultByIndexService) {
    }

    ngOnInit() {
        this.apiService.visibilitiesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.qcStatuses = data;
            } );

        this.apiService.getVisibilities();
    }


    onQcBulkStatusClick( n ) {
        this.visible = n;
    }


    onQcBulkStatusCompleteClick( c ) {
        this.isComplete = c;
    }


    onQcBulkStatusReleasedClick( r ) {
        this.isReleased = r;
    }

    onQcUpdateNextClick() {
        this.onQcUpdate();
        this.searchResultByIndexService.updateCurrentSearchResultByIndex(0);

    }

    onQcSkipNextClick(){
        // FIXMENOW this is for the high light in the search results, it must be renamed
        this.searchResultByIndexService.updateCurrentSearchResultByIndex(0);

    }

    onQcUpdate(){
        let query = 'projectSite=' + this.collectionSite;

        query += '&seriesId=' + this.seriesData['series'];

        if(  this.isComplete === this.YES ){
            query += '&complete=Complete';
        }
        if(  this.isComplete === this.NO ){
            query += '&complete=NotComplete';
        }
        if(  this.isReleased === this.YES ){
            query += '&released=released';
        }
        if(  this.isReleased === this.NO ){
            query += '&released=NotReleased';
        }

        if( this.useBatchNumber ){
            query += '&batch=' + this.batchNumber;
        }

        if( this.visible >= 0){
            query += '&newQcStatus=' + Consts.QC_STATUSES[this.visible];
        }

        if(! this.utilService.isNullOrUndefinedOrEmpty( this.logText)){
            query += '&comment=' + this.logText;
        }
        if( Properties.DEMO_MODE){
            console.log('DEMO mode: Perform QC  Update ', query );
        }
        else{
            this.apiService.doSubmit(Consts.TOOL_BULK_QC, query);
        }
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
