import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformQcComponent } from './perform-qc.component';
import { QuerySectionComponent } from '@app/tools/query-section-module/query-section/query-section.component';
import { DisplayQueryComponent } from '@app/tools/display-query-module/display-query/display-query.component';
import { SearchResultsSectionBravoComponent } from '@app/tools/search-results-section-module/search-results-section-bravo/search-results-section-bravo.component';
import { PerformQcBulkOperationsComponent } from '@app/tools/perform-qc-module/perform-qc/perform-qc-bulk-operations/perform-qc-bulk-operations.component';
import { QcHistoryReportComponent } from '@app/tools/qc-history-report-module/qc-history-report/qc-history-report.component';
import { LeftSectionComponent } from '@app/tools/query-section-module/left-section/left-section.component';
import { FormsModule } from '@angular/forms';
import { NgxKeyboardShortcutModule } from 'ngx-keyboard-shortcuts';
import { AngularDraggableModule } from 'angular2-draggable';
import { QcHistoryReportTableComponent } from '@app/tools/qc-history-report-module/qc-history-report-table/qc-history-report-table.component';
import { QueryQcStatusComponent } from '@app/tools/query-section-module/query-qc-status/query-qc-status.component';
import { QueryCollectionComponent } from '@app/tools/query-section-module/query-collection/query-collection.component';
import { DynamicQueryCriteriaComponent } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import { QueryReleasedComponent } from '@app/tools/query-section-module/query-released/query-released.component';
import { QueryBatchComponent } from '@app/tools/query-section-module/query-batch/query-batch.component';
import { QueryConfirmedComponent } from '@app/tools/query-section-module/query-confirmed/query-confirmed.component';
import { QueryPatientIdComponent } from '@app/tools/query-section-module/query-patient-id/query-patient-id.component';
import { QueryMostRecentSubmissionDateComponent } from '@app/tools/query-section-module/query-most-recent-submission-date/query-most-recent-submission-date.component';
import { LargeTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/large-text-input/large-text-input.component';
import { SmallTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/small-text-input/small-text-input.component';
import { DateRangeComponent } from '@app/tools/query-section-module/dynamic-query-criteria/date-range/date-range.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { SingleCheckboxComponent } from '@app/tools/query-section-module/dynamic-query-criteria/single-checkbox/single-checkbox.component';
import { SingleChoiceListComponent } from '@app/tools/query-section-module/dynamic-query-criteria/single-choice-list/single-choice-list.component';
import { MultiChoiceListComponent } from '@app/tools/query-section-module/dynamic-query-criteria/multi-choice-list/multi-choice-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe( 'PerformQcComponent', () => {
    let component: PerformQcComponent;
    let fixture: ComponentFixture<PerformQcComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [
                NgxKeyboardShortcutModule.forRoot(),
                NgxMyDatePickerModule.forRoot(),
                AngularDraggableModule,
                HttpClientModule,
                RouterTestingModule,
                FormsModule,
            ],
            declarations: [
                PerformQcComponent,
                QuerySectionComponent,
                DisplayQueryComponent,
                SearchResultsSectionBravoComponent,
                PerformQcComponent,
                PerformQcBulkOperationsComponent,
                QcHistoryReportComponent,
                LeftSectionComponent,
                QcHistoryReportTableComponent,
                QueryQcStatusComponent,
                QueryCollectionComponent,
                DynamicQueryCriteriaComponent,
                QueryReleasedComponent,
                QueryBatchComponent,
                QueryConfirmedComponent,
                QueryPatientIdComponent,
                QueryMostRecentSubmissionDateComponent,
                LargeTextInputComponent,
                SmallTextInputComponent,
                DateRangeComponent,
                SingleCheckboxComponent,
                SingleChoiceListComponent,
                MultiChoiceListComponent


            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( PerformQcComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
