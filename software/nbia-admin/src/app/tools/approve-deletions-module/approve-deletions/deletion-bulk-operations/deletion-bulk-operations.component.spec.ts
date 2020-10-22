import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletionBulkOperationsComponent } from './deletion-bulk-operations.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe( 'DeletionBulkOperationsComponent', () => {
    let component: DeletionBulkOperationsComponent;
    let fixture: ComponentFixture<DeletionBulkOperationsComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [DeletionBulkOperationsComponent],
            imports: [RouterTestingModule, HttpClientModule, FormsModule],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( DeletionBulkOperationsComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
