import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcHistoryReportComponent } from './qc-history-report.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { QcHistoryReportTableComponent } from '@app/tools/qc-history-report-module/qc-history-report-table/qc-history-report-table.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe( 'QcHistoryReportComponent', () => {
    let component: QcHistoryReportComponent;
    let fixture: ComponentFixture<QcHistoryReportComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [
                QcHistoryReportComponent,
                QcHistoryReportTableComponent,
            ],
            imports: [
                AngularDraggableModule,
                RouterTestingModule,
                HttpClientModule,
            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( QcHistoryReportComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
