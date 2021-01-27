import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NbiaAdminClientComponent } from './nbia-admin-client.component';
import { LoginComponent } from '@app/login/login.component';
import { PreferencesComponent } from '@app/preferences/preferences.component';
import { LoadingDisplayComponent } from '@app/admin-common/components/loading-display/loading-display.component';
import { ToolTitleComponent } from '@app/header-module/header/tool-title/tool-title.component';
import { ApproveDeletionsComponent } from '@app/tools/approve-deletions-module/approve-deletions/approve-deletions.component';
import { EditCollectionDescriptionsComponent } from '@app/tools/edit-collection-descriptions-module/edit-collection-descriptions/edit-collection-descriptions.component';
import { PerformQcComponent } from '@app/tools/perform-qc-module/perform-qc/perform-qc.component';
import { EditLicenseComponent } from '@app/tools/edit-license-module/edit-license/edit-license.component';
import { PerformOnlineDeletionComponent } from '@app/tools/perform-online-deletion-module/perform-online-deletion/perform-online-deletion.component';
import { CineModeBravoComponent } from '@app/tools/cine-mode-module/cine-mode-bravo/cine-mode-bravo.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { FormsModule } from '@angular/forms';
import { QuerySectionComponent } from '@app/tools/query-section-module/query-section/query-section.component';
import { DisplayQueryComponent } from '@app/tools/display-query-module/display-query/display-query.component';
import { SearchResultsSectionBravoComponent } from '@app/tools/search-results-section-module/search-results-section-bravo/search-results-section-bravo.component';
import { DeletionBulkOperationsComponent } from '@app/tools/approve-deletions-module/approve-deletions/deletion-bulk-operations/deletion-bulk-operations.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PerformQcBulkOperationsComponent } from '@app/tools/perform-qc-module/perform-qc/perform-qc-bulk-operations/perform-qc-bulk-operations.component';
import { QcHistoryReportComponent } from '@app/tools/qc-history-report-module/qc-history-report/qc-history-report.component';
import { QcStatusEditComponent } from '@app/tools/cine-mode-module/qc-status-edit/qc-status-edit.component';
import { DeleteCinemodeSeriesComponent } from '@app/tools/cine-mode-module/delete-cinemode-series/delete-cinemode-series.component';
import { QcHistoryReportTableComponent } from '@app/tools/qc-history-report-module/qc-history-report-table/qc-history-report-table.component';
import { ProgressBarModule } from 'angular-progress-bar';
import { LeftSectionComponent } from '@app/tools/query-section-module/left-section/left-section.component';
import { NgxKeyboardShortcutModule } from 'ngx-keyboard-shortcuts';
import { QueryQcStatusComponent } from '@app/tools/query-section-module/query-qc-status/query-qc-status.component';
import { QueryCollectionComponent } from '@app/tools/query-section-module/query-collection/query-collection.component';
import { DynamicQueryCriteriaComponent } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import { QueryReleasedComponent } from '@app/tools/query-section-module/query-released/query-released.component';
import { QueryBatchComponent } from '@app/tools/query-section-module/query-batch/query-batch.component';
import { QueryConfirmedComponent } from '@app/tools/query-section-module/query-confirmed/query-confirmed.component';
import { QueryPatientIdComponent } from '@app/tools/query-section-module/query-patient-id/query-patient-id.component';
import { QueryMostRecentSubmissionDateComponent } from '@app/tools/query-section-module/query-most-recent-submission-date/query-most-recent-submission-date.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe( 'NbiaAdminClientComponent', () => {
    let component: NbiaAdminClientComponent;
    let fixture: ComponentFixture<NbiaAdminClientComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [
                AngularDraggableModule,
                FormsModule,
                AngularEditorModule,
                ProgressBarModule,
                NgxKeyboardShortcutModule.forRoot(),
                NgxMyDatePickerModule.forRoot(),
                RouterTestingModule,
                HttpClientModule,
                AngularEditorModule,


            ],
            providers: [HttpClient],
            declarations: [
                NbiaAdminClientComponent,
                LoginComponent,
                PreferencesComponent,
                LoadingDisplayComponent,
                ToolTitleComponent,
                ApproveDeletionsComponent,
                EditCollectionDescriptionsComponent,
                PerformQcComponent,
                EditLicenseComponent,
                PerformOnlineDeletionComponent,
                CineModeBravoComponent,
                QuerySectionComponent,
                DisplayQueryComponent,
                SearchResultsSectionBravoComponent,
                DeletionBulkOperationsComponent,
                PerformQcBulkOperationsComponent,
                QcHistoryReportComponent,
                QcStatusEditComponent,
                DeleteCinemodeSeriesComponent,
                QcHistoryReportTableComponent,
                LeftSectionComponent,
                QueryQcStatusComponent,
                QueryCollectionComponent,
                DynamicQueryCriteriaComponent,
                QueryReleasedComponent,
                QueryBatchComponent,
                QueryConfirmedComponent,
                QueryPatientIdComponent,
                QueryMostRecentSubmissionDateComponent
            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( NbiaAdminClientComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
