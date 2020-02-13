import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewSubmissionReportsComponent } from './view-submission-reports/view-submission-reports.component';



@NgModule( {
    declarations: [ViewSubmissionReportsComponent],
    exports: [
        ViewSubmissionReportsComponent
    ],
    imports: [
        CommonModule
    ]
})
export class ViewSubmissionReportsModule { }
