import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiChoiceListComponent } from './multi-choice-list.component';
import { FormsModule } from '@angular/forms';
import { DynamicQueryCriteriaComponent } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import { LargeTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/large-text-input/large-text-input.component';
import { SmallTextInputComponent } from '@app/tools/query-section-module/dynamic-query-criteria/small-text-input/small-text-input.component';
import { Component } from '@angular/core';
import { DateRangeComponent } from '@app/tools/query-section-module/dynamic-query-criteria/date-range/date-range.component';
import { SingleCheckboxComponent } from '@app/tools/query-section-module/dynamic-query-criteria/single-checkbox/single-checkbox.component';
import { SingleChoiceListComponent } from '@app/tools/query-section-module/dynamic-query-criteria/single-choice-list/single-choice-list.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

describe( 'MultiChoiceListComponent', () => {
    let component: MultiChoiceListComponent;
    let fixture: ComponentFixture<MultiChoiceListComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [FormsModule,
                NgxMyDatePickerModule.forRoot(),
            ],
            declarations: [
                MultiChoiceListComponent,
                LargeTextInputComponent,
                SmallTextInputComponent,
                DateRangeComponent,
                SingleCheckboxComponent,
                SingleChoiceListComponent,

            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( MultiChoiceListComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
