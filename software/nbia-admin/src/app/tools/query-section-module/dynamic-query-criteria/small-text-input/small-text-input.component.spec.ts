import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallTextInputComponent } from './small-text-input.component';
import { FormsModule } from '@angular/forms';
import { DynamicQueryCriteriaComponent } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import { LargeTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/large-text-input/large-text-input.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { DateRangeComponent } from '@app/tools/query-section-module/dynamic-query-criteria/date-range/date-range.component';
import { SingleCheckboxComponent } from '@app/tools/query-section-module/dynamic-query-criteria/single-checkbox/single-checkbox.component';
import { SingleChoiceListComponent } from '@app/tools/query-section-module/dynamic-query-criteria/single-choice-list/single-choice-list.component';
import { MultiChoiceListComponent } from '@app/tools/query-section-module/dynamic-query-criteria/multi-choice-list/multi-choice-list.component';

describe( 'SmallTextInputComponent', () => {
    let component: SmallTextInputComponent;
    let fixture: ComponentFixture<SmallTextInputComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [FormsModule,                 NgxMyDatePickerModule.forRoot(),
            ],
            declarations: [
                SmallTextInputComponent,
                DynamicQueryCriteriaComponent,
                LargeTextInputComponent,
                SmallTextInputComponent,
                DateRangeComponent,
                SingleCheckboxComponent,
                SingleChoiceListComponent,
                MultiChoiceListComponent

            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( SmallTextInputComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
