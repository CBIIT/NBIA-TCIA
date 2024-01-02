import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QcHistoryReportTableComponent } from './qc-history-report-table/qc-history-report-table.component';
import { FormsModule } from '@angular/forms';
import { QcHistoryReportComponent } from './qc-history-report/qc-history-report.component';



@NgModule( {
    declarations: [QcHistoryReportTableComponent, QcHistoryReportComponent],
    exports: [
        QcHistoryReportTableComponent,
        QcHistoryReportComponent
    ],
    imports: [
        FormsModule,
        CommonModule
    ]
})
export class QcHistoryReportModuleModule { }
