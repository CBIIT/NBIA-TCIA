import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeComponent } from './date-range.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { FormsModule } from '@angular/forms';
import { DynamicQueryCriteriaComponent } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import { LargeTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/large-text-input/large-text-input.component';
import { SmallTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/small-text-input/small-text-input.component';
import { SingleCheckboxComponent } from '@app/tools/query-section-module/dynamic-query-criteria/single-checkbox/single-checkbox.component';
import { SingleChoiceListComponent } from '@app/tools/query-section-module/dynamic-query-criteria/single-choice-list/single-choice-list.component';
import { MultiChoiceListComponent } from '@app/tools/query-section-module/dynamic-query-criteria/multi-choice-list/multi-choice-list.component';
import { DynamicQueryCriteriaService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service';

describe( 'DateRangeComponent', () => {
    let component: DateRangeComponent;
    let fixture: ComponentFixture<DateRangeComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [
                FormsModule,
                NgxMyDatePickerModule.forRoot(),
            ],
             providers: [DynamicQueryCriteriaService ],
            declarations: [
                DateRangeComponent,
                DynamicQueryCriteriaComponent,
                LargeTextInputComponent,
                SmallTextInputComponent,
                SingleCheckboxComponent,
                SingleChoiceListComponent,
                MultiChoiceListComponent,
            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( DateRangeComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
