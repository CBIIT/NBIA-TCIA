import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryMostRecentSubmissionDateComponent } from './query-most-recent-submission-date.component';
import { FormsModule } from '@angular/forms';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

describe( 'QcMostRecentSubmissionDateComponent', () => {
    let component: QueryMostRecentSubmissionDateComponent;
    let fixture: ComponentFixture<QueryMostRecentSubmissionDateComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [NgxMyDatePickerModule.forRoot(), FormsModule],
            declarations: [QueryMostRecentSubmissionDateComponent],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent(
            QueryMostRecentSubmissionDateComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
