import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcSeriesReportComponent } from './qc-series-report.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { QcSeriesReportTableComponent } from '@app/tools/qc-series-report-module/qc-series-report-table/qc-series-report-table.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe( 'QcSeriesReportComponent', () => {
    let component: QcSeriesReportComponent;
    let fixture: ComponentFixture<QcSeriesReportComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [
                QcSeriesReportComponent,
                QcSeriesReportTableComponent,
            ],
            imports: [
                AngularDraggableModule,
                RouterTestingModule,
                HttpClientModule,
            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( QcSeriesReportComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
