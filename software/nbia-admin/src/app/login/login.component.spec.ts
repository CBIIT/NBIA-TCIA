import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { ApiService } from '@app/admin-common/services/api.service';
import { AngularDraggableModule } from 'angular2-draggable';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [LoginComponent],
            providers: [
                AccessTokenService,
                UtilService,
                ApiService,
                HttpClient,
            ],
            imports: [
                AngularDraggableModule,
                FormsModule,
                HttpClientModule,
                RouterTestingModule,
            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( LoginComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
