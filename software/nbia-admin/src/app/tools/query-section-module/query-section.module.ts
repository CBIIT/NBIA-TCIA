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
import { AppRoutingModule } from '@app/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from '@app/header-module/header.module';
import { ViewSubmissionReportsModule } from '../view-submission-reports-module/view-submission-reports.module';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { PerformOnlineDeletionModule } from '../perform-online-deletion-module/perform-online-deletion.module';
import { MomentModule } from 'ngx-moment';
import { AngularDraggableModule } from 'angular2-draggable';
import { AngularResizedEventModule } from 'angular-resize-event';
import { TabsModule } from 'ngx-tabs';
import { DynamicQueryCriteriaComponent } from './dynamic-query-criteria/dynamic-query-criteria.component';
import { LargeTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/large-text-input/large-text-input.component';
import { SmallTextInputComponent } from './dynamic-query-criteria/small-text-input/small-text-input.component';
import { DateRangeComponent } from './dynamic-query-criteria/date-range/date-range.component';
import { MultiChoiceListComponent } from './dynamic-query-criteria/multi-choice-list/multi-choice-list.component';
import { SingleChoiceListComponent } from './dynamic-query-criteria/single-choice-list/single-choice-list.component';
import { SingleCheckboxComponent } from './dynamic-query-criteria/single-checkbox/single-checkbox.component';
import { SingleChoiceOneLineComponent } from './dynamic-query-criteria/single-choice-one-line/single-choice-one-line.component';



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
        QuerySectionComponent,
        LargeTextInputComponent,
        DynamicQueryCriteriaComponent,
        SmallTextInputComponent,
        DateRangeComponent,
        MultiChoiceListComponent,
        SingleChoiceListComponent,
        SingleCheckboxComponent,
        SingleChoiceOneLineComponent
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
