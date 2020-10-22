// -------------------------------------------------------------------------------------------
// ------------  Series History - popup in "Perform Quality Control"  not Cine mode  ---------
// -------------------------------------------------------------------------------------------

import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '@app/admin-common/services/api.service';


@Component( {
    selector: 'nbia-qc-history-report',
    templateUrl: './qc-history-report.component.html',
    styleUrls: ['./qc-history-report.component.scss']
} )

export class QcHistoryReportComponent implements OnInit, OnDestroy{
    handleMoving = false;
    showReport = false;
    qcStatusReportResults = [];
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService ) {
    }

    ngOnInit() {
        this.apiService.qcHistoryResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.qcStatusReportResults = data;

                // Sort by Series Id then Time Stamp
                this.qcStatusReportResults.sort( ( row1, row2 ) =>
                    row1['series'] < row2['series'] ? 1 : row1['series'] > row2['series'] ? 1 : row1['timeStamp'] < row2['timeStamp'] ? -1 : 1 );

                this.showReport = true;
            } );


    }

    /////////////////////////
    onDragBegin( e ) {
        this.handleMoving = true;
    }

    onMoveEnd( e ) {
        this.handleMoving = false;
    }

    closeQcHistoryReportClick() {
        this.showReport = false;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
