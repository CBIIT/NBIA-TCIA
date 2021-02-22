import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSectionComponent } from './left-section.component';
import { QueryQcStatusComponent } from '@app/tools/query-section-module/query-qc-status/query-qc-status.component';
import { QueryCollectionComponent } from '@app/tools/query-section-module/query-collection/query-collection.component';
import { DynamicQueryCriteriaComponent } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import { QueryReleasedComponent } from '@app/tools/query-section-module/query-released/query-released.component';
import { QueryBatchComponent } from '@app/tools/query-section-module/query-batch/query-batch.component';
import { QueryConfirmedComponent } from '@app/tools/query-section-module/query-confirmed/query-confirmed.component';
import { QueryPatientIdComponent } from '@app/tools/query-section-module/query-patient-id/query-patient-id.component';
import { QueryMostRecentSubmissionDateComponent } from '@app/tools/query-section-module/query-most-recent-submission-date/query-most-recent-submission-date.component';
import { FormsModule } from '@angular/forms';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

describe( 'LeftSectionComponent', () => {
    let component: LeftSectionComponent;
    let fixture: ComponentFixture<LeftSectionComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [FormsModule, NgxMyDatePickerModule.forRoot()],
            declarations: [
                LeftSectionComponent,
                QueryQcStatusComponent,
                QueryCollectionComponent,
                DynamicQueryCriteriaComponent,
                QueryReleasedComponent,
                QueryBatchComponent,
                QueryConfirmedComponent,
                QueryMostRecentSubmissionDateComponent,
                QueryPatientIdComponent
            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( LeftSectionComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
