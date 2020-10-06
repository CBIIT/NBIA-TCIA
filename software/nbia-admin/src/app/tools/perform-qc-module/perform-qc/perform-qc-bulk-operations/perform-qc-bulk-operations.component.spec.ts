import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformQcBulkOperationsComponent } from './perform-qc-bulk-operations.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe( 'PerformQcBulkOperationsComponent', () => {
    let component: PerformQcBulkOperationsComponent;
    let fixture: ComponentFixture<PerformQcBulkOperationsComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [HttpClientModule, RouterTestingModule, FormsModule],
            declarations: [PerformQcBulkOperationsComponent],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( PerformQcBulkOperationsComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
