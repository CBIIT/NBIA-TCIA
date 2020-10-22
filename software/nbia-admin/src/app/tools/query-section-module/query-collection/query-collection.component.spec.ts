import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryCollectionComponent } from './query-collection.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe( 'QcCollectionComponent', () => {
    let component: QueryCollectionComponent;
    let fixture: ComponentFixture<QueryCollectionComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [QueryCollectionComponent],
            providers: [HttpClient],
            imports: [FormsModule, RouterTestingModule, HttpClientModule,
            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( QueryCollectionComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
