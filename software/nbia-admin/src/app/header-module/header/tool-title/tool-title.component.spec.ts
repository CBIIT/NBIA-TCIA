import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolTitleComponent } from './tool-title.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe( 'ToolTitleComponent', () => {
    let component: ToolTitleComponent;
    let fixture: ComponentFixture<ToolTitleComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [ToolTitleComponent],
            providers: [HttpClient],
            imports: [HttpClientModule],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( ToolTitleComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
