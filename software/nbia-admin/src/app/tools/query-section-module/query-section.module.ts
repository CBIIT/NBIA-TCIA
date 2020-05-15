import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftSectionComponent } from './left-section/left-section.component';
import { QueryBatchComponent } from './query-batch/query-batch.component';
import { QueryCollectionComponent } from './query-collection/query-collection.component';
import { QueryConfirmedComponent } from './query-confirmed/query-confirmed.component';
import { QueryMostRecentSubmissionDateComponent } from './query-most-recent-submission-date/query-most-recent-submission-date.component';
import { QueryPatientIdComponent } from './query-patient-id/query-patient-id.component';
import { QueryQcStatusComponent } from './query-qc-status/query-qc-status.component';
import { QueryReleasedComponent } from './query-released/query-released.component';
import { QuerySectionComponent } from './query-section/query-section.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from '../../header-module/header.module';
import { ViewSubmissionReportsModule } from '../view-submission-reports-module/view-submission-reports.module';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { PerformOnlineDeletionModule } from '../perform-online-deletion-module/perform-online-deletion.module';
import { MomentModule } from 'ngx-moment';
import { AngularDraggableModule } from 'angular2-draggable';
import { AngularResizedEventModule } from 'angular-resize-event';
import { TabsModule } from 'ngx-tabs';



@NgModule( {
    declarations: [
        LeftSectionComponent,
        QueryBatchComponent,
        QueryCollectionComponent,
        QueryConfirmedComponent,
        QueryMostRecentSubmissionDateComponent,
        QueryPatientIdComponent,
        QueryQcStatusComponent,
        QueryReleasedComponent,
        QuerySectionComponent
    ],
    exports: [
        LeftSectionComponent,
        QueryBatchComponent,
        QueryCollectionComponent,
        QueryConfirmedComponent,
        QueryMostRecentSubmissionDateComponent,
        QueryPatientIdComponent,
        QueryQcStatusComponent,
        QueryReleasedComponent,
        QuerySectionComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        HeaderModule,
        ViewSubmissionReportsModule,
        NgxMyDatePickerModule.forRoot(),
        PerformOnlineDeletionModule,
        MomentModule,
        AngularDraggableModule,
        TabsModule,
        AngularResizedEventModule
    ]
} )
export class QuerySectionModule{
}
