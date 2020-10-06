import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCheckboxComponent } from './single-checkbox.component';
import { FormsModule } from '@angular/forms';
import { DynamicQueryCriteriaComponent } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import { LargeTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/large-text-input/large-text-input.component';
import { SmallTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/small-text-input/small-text-input.component';
import { DateRangeComponent } from '@app/tools/query-section-module/dynamic-query-criteria/date-range/date-range.component';
import { SingleChoiceListComponent } from '@app/tools/query-section-module/dynamic-query-criteria/single-choice-list/single-choice-list.component';
import { MultiChoiceListComponent } from '@app/tools/query-section-module/dynamic-query-criteria/multi-choice-list/multi-choice-list.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

describe( 'SingleCheckboxComponent', () => {
    let component: SingleCheckboxComponent;
    let fixture: ComponentFixture<SingleCheckboxComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [FormsModule, NgxMyDatePickerModule.forRoot()],
            declarations: [
                SingleCheckboxComponent,
                DynamicQueryCriteriaComponent,
                LargeTextInputComponent,
                SmallTextInputComponent,
                DateRangeComponent,
                SingleChoiceListComponent,
                MultiChoiceListComponent,
            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( SingleCheckboxComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
