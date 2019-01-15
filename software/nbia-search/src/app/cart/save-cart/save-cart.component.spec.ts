import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveCartComponent } from './save-cart.component';
import { ClipboardModule } from 'ngx-clipboard';
import { CommonService } from '@app/image-search/services/common.service';
import { ConnectionBackend, Http } from '@angular/http';

describe( 'SaveCartComponent', () => {
    let component: SaveCartComponent;
    let fixture: ComponentFixture<SaveCartComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
                declarations: [SaveCartComponent],
                providers: [CommonService, Http, ConnectionBackend],
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
