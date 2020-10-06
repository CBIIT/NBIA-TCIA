import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from '@app/header-module/header/header.component';
import { FooterComponent } from '@app/footer/footer.component';
import { CustomMenuComponent } from '@app/header-module/header/custom-menu/custom-menu.component';
import { HttpClientModule } from '@angular/common/http';

describe( 'AppComponent', () => {
    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [
                AppComponent,
                HeaderComponent,
                FooterComponent,
                CustomMenuComponent,
            ],
        } ).compileComponents();
    } ) );

    it( 'should create the app', () => {
        const fixture = TestBed.createComponent( AppComponent );
        const app = fixture.debugElement.componentInstance;
        expect( app ).toBeTruthy();
    } );

    it( `should have as title 'nbia-admin'`, () => {
        const fixture = TestBed.createComponent( AppComponent );
        const app = fixture.debugElement.componentInstance;
        expect( app.title ).toEqual( 'nbia-admin' );
    } );

    it( 'should render title', () => {
        const fixture = TestBed.createComponent( AppComponent );
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect( compiled.querySelector( '.content span' ).textContent ).toContain(
            'nbia-admin app is running!'
        );
    } );
} );
