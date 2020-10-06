import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsSectionBravoComponent } from './search-results-section-bravo.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'angular2-cookie';
import { NgxKeyboardShortcutModule } from 'ngx-keyboard-shortcuts';

describe( 'SearchResultsSectionBravoComponent', () => {
    let component: SearchResultsSectionBravoComponent;
    let fixture: ComponentFixture<SearchResultsSectionBravoComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [
                RouterTestingModule,
                HttpClientModule,
                NgxKeyboardShortcutModule.forRoot(),
                FormsModule,
            ],
            providers: [CookieService],
            declarations: [SearchResultsSectionBravoComponent],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( SearchResultsSectionBravoComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
