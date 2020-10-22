import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcStatusEditComponent } from './qc-status-edit.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe( 'QcStatusEditComponent', () => {
    let component: QcStatusEditComponent;
    let fixture: ComponentFixture<QcStatusEditComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [RouterTestingModule, HttpClientModule, FormsModule],
            declarations: [QcStatusEditComponent],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( QcStatusEditComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
