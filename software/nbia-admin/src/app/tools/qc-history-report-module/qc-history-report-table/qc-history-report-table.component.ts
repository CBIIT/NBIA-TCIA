import { Component, Input, OnInit } from '@angular/core';
import { PerformQcService } from '../../perform-qc-module/services/perform-qc.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-qc-history-report-table',
    templateUrl: './qc-history-report-table.component.html',
    styleUrls: ['./qc-history-report-table.component.scss']
} )
export class QcHistoryReportTableComponent implements OnInit{

    @Input () qcStatusReportResults = [];


    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( ) {
    }

    ngOnInit() {
        // @ts-ignore
        $( function() {
            // @ts-ignore
            $( '#normal' ).colResizable( {
                liveDrag: true,
                gripInnerHtml: '<div class=\'grip\'></div>',
                draggingClass: 'dragging',
                resizeMode: 'fit'
            } );

            // @ts-ignore
            $( '#flex' ).colResizable( {
                liveDrag: true,
                gripInnerHtml: '<div class=\'grip\'></div>',
                draggingClass: 'dragging',
                resizeMode: 'flex'
            } );


            // @ts-ignore
            $( '#overflow' ).colResizable( {
                liveDrag: true,
                gripInnerHtml: '<div class=\'grip\'></div>',
                draggingClass: 'dragging',
                resizeMode: 'overflow'
            } );


            // @ts-ignore
            $( '#disabled' ).colResizable( {
                liveDrag: true,
                gripInnerHtml: '<div class=\'grip\'></div>',
                draggingClass: 'dragging',
                resizeMode: 'overflow',
                disabledColumns: [2]
            } );


        } );
    }


}
