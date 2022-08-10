// -------------------------------------------------------------------------------------------
// -------------------------     Table section of Series Info     ------------------------
// -------------------------------------------------------------------------------------------

import { Component, Input, OnInit } from '@angular/core';


@Component( {
    selector: 'nbia-qc-series-report-table',
    templateUrl: './qc-series-report-table.component.html',
    styleUrls: ['./qc-series-report-table.component.scss']
} )

export class QcSeriesReportTableComponent implements OnInit{
    @Input () qcSeriesReportResults = [];

    constructor( ) {
    }

    ngOnInit() {
    }


}
