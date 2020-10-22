import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChoiceListComponent } from './single-choice-list.component';
import { FormsModule } from '@angular/forms';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { SingleCheckboxComponent } from '@app/tools/query-section-module/dynamic-query-criteria/single-checkbox/single-checkbox.component';
import { DynamicQueryCriteriaComponent } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import { LargeTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/large-text-input/large-text-input.component';
import { SmallTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/small-text-input/small-text-input.component';
import { DateRangeComponent } from '@app/tools/query-section-module/dynamic-query-criteria/date-range/date-range.component';
import { MultiChoiceListComponent } from '@app/tools/query-section-module/dynamic-query-criteria/multi-choice-list/multi-choice-list.component';

describe( 'SingleChoiceListComponent', () => {
    let component: SingleChoiceListComponent;
    let fixture: ComponentFixture<SingleChoiceListComponent>;

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
                SingleChoiceListComponent,
            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( SingleChoiceListComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
