import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryBatchComponent } from './query-batch.component';
import { FormsModule } from '@angular/forms';

describe( 'QcBatchComponent', () => {
    let component: QueryBatchComponent;
    let fixture: ComponentFixture<QueryBatchComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [FormsModule],
            declarations: [QueryBatchComponent],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( QueryBatchComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
