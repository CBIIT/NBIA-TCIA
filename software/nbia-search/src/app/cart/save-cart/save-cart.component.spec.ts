import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveCartComponent } from './save-cart.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonService } from '@app/image-search/services/common.service';
import { HttpBackend, HttpClient } from '@angular/common/http';

describe( 'SaveCartComponent', () => {
    let component: SaveCartComponent;
    let fixture: ComponentFixture<SaveCartComponent>;

    beforeEach( waitForAsync( () => {
        TestBed.configureTestingModule( {
                declarations: [SaveCartComponent],
                providers: [CommonService, HttpClient, HttpBackend],
                imports: [ClipboardModule]
            } )
            .compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( SaveCartComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
