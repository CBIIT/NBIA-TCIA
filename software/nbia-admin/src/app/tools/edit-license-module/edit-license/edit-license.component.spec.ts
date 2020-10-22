import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLicenseComponent } from './edit-license.component';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe( 'EditLicenseComponent', () => {
    let component: EditLicenseComponent;
    let fixture: ComponentFixture<EditLicenseComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [RouterTestingModule, AngularDraggableModule,                 HttpClientModule,
                FormsModule],
            declarations: [EditLicenseComponent],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( EditLicenseComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
