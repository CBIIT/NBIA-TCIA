import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QcToolComponent } from './qc-tool/qc-tool.component';
import { QueryQcStatusComponent } from '../query-section-module/query-qc-status/query-qc-status.component';
import { QueryReleasedComponent } from '../query-section-module/query-released/query-released.component';
import { QueryBatchComponent } from '../query-section-module/query-batch/query-batch.component';
import { QueryConfirmedComponent } from '../query-section-module/query-confirmed/query-confirmed.component';
import { QueryPatientIdComponent } from '../query-section-module/query-patient-id/query-patient-id.component';
import { QueryMostRecentSubmissionDateComponent } from '../query-section-module/query-most-recent-submission-date/query-most-recent-submission-date.component';
import { FormsModule } from '@angular/forms';
import { LeftSectionComponent } from '../query-section-module/left-section/left-section.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { AdminCommonPipeModule } from '../../admin-common/admin-common-pipe-module/admin-common-pipe.module';
import { QueryCollectionComponent } from '../query-section-module/query-collection/query-collection.component';
import { AppModule } from '../../app.module';
import { DisplayQueryModule } from '../display-query-module/display-query.module';
import { QuerySectionModule } from '../query-section-module/query-section.module';


@NgModule( {
    declarations: [
        QcToolComponent,
/*
        QueryQcStatusComponent,
        QueryCollectionComponent,
        QueryReleasedComponent,
        QueryBatchComponent,
        QueryConfirmedComponent,
        QueryPatientIdComponent,
        QueryMostRecentSubmissionDateComponent,
*/

    ],
    exports: [
        QcToolComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxMyDatePickerModule,
        AdminCommonPipeModule,
        DisplayQueryModule,
        QuerySectionModule
    ]
} )
export class QcToolModule{
}
