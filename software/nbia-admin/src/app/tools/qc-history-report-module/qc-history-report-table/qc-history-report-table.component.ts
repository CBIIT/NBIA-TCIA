// -------------------------------------------------------------------------------------------
// -------------------------     Table section of Series History      ------------------------
// -------------------------------------------------------------------------------------------

import { Component, Input, OnInit } from '@angular/core';


@Component( {
    selector: 'nbia-qc-history-report-table',
    templateUrl: './qc-history-report-table.component.html',
    styleUrls: ['./qc-history-report-table.component.scss']
} )

export class QcHistoryReportTableComponent implements OnInit{
    @Input () qcStatusReportResults = [];

    constructor( ) {
    }

    ngOnInit() {
    }


}
