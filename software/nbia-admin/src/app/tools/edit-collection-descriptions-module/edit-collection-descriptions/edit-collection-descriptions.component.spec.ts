import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCollectionDescriptionsComponent } from './edit-collection-descriptions.component';
import { FormsModule } from '@angular/forms';
import { QuerySectionComponent } from '@app/tools/query-section-module/query-section/query-section.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LeftSectionComponent } from '@app/tools/query-section-module/left-section/left-section.component';
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

describe( 'EditCollectionDescriptionsComponent', () => {
    let component: EditCollectionDescriptionsComponent;
    let fixture: ComponentFixture<EditCollectionDescriptionsComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [
                FormsModule,
                NgxMyDatePickerModule.forRoot(),
                RouterTestingModule,
                HttpClientModule,
                AngularEditorModule,
            ],
            declarations: [
                EditCollectionDescriptionsComponent,
                QuerySectionComponent,
                LeftSectionComponent,
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
        fixture = TestBed.createComponent( EditCollectionDescriptionsComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
