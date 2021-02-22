import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicQueryCriteriaComponent } from './dynamic-query-criteria.component';
import { FormsModule } from '@angular/forms';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

describe( 'DynamicQueryCriteriaComponent', () => {
    let component: DynamicQueryCriteriaComponent;
    let fixture: ComponentFixture<DynamicQueryCriteriaComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [FormsModule,
                NgxMyDatePickerModule.forRoot(),
            ],
            declarations: [
                DynamicQueryCriteriaComponent
            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( DynamicQueryCriteriaComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
