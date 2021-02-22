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
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
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
                QueryMostRecentSubmissionDateComponent
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
