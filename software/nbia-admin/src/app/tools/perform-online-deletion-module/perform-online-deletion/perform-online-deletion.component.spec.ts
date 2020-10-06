import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformOnlineDeletionComponent } from './perform-online-deletion.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe( 'PerformOnlineDeletionComponent', () => {
    let component: PerformOnlineDeletionComponent;
    let fixture: ComponentFixture<PerformOnlineDeletionComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [                 HttpClientModule,
                 RouterTestingModule],
            declarations: [PerformOnlineDeletionComponent],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( PerformOnlineDeletionComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
