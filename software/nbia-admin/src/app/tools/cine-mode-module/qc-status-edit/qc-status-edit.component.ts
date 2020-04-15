import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilService } from '@app/admin-common/services/util.service';
import { SearchResultByIndexService } from '@app/tools/search-results-section-module/services/search-result-by-index.service';

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
        console.log('MHL onQcBulkStatusClick: ', n );
        this.visible = n;
    }


    onQcBulkStatusCompleteClick( c ) {
        this.isComplete = c;
        console.log('MHL onQcBulkStatusCompleteClick: ', c );
    }


    onQcBulkStatusReleasedClick( r ) {
        this.isReleased = r;
        console.log('MHL onQcBulkStatusReleasedClick: ', r );

    }

    onQcUpdateNextClick() {
        console.log('MHL onQcUpdateNextClick');

    }

    onQcSkipNextClick(){
        console.log('MHL onQcSkipNextClick');
        this.searchResultByIndexService.updateCurrentSearchResultByIndex(0);
        // updateCurrentSearchResultByIndex
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
