import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeTextInputComponent } from './large-text-input.component';
import { FormsModule } from '@angular/forms';

describe( 'LargeTextInputComponent', () => {
    let component: LargeTextInputComponent;
    let fixture: ComponentFixture<LargeTextInputComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [FormsModule],
            declarations: [LargeTextInputComponent],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( LargeTextInputComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
