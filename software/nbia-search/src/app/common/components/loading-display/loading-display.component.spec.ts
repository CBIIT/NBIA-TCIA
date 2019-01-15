import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingDisplayComponent } from './loading-display.component';
import { LoadingDisplayService } from './loading-display.service';

describe( 'LoadingDisplayComponent', () => {
    let component: LoadingDisplayComponent;
    let fixture: ComponentFixture<LoadingDisplayComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [LoadingDisplayComponent],
            providers: [LoadingDisplayService]
        } )
            .compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( LoadingDisplayComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should be created', () => {
        expect( component ).toBeTruthy();
    } );
} );
