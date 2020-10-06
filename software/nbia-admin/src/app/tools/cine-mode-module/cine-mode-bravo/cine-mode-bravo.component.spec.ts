import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CineModeBravoComponent } from './cine-mode-bravo.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { FormsModule } from '@angular/forms';
import { QcStatusEditComponent } from '@app/tools/cine-mode-module/qc-status-edit/qc-status-edit.component';
import { DeleteCinemodeSeriesComponent } from '@app/tools/cine-mode-module/delete-cinemode-series/delete-cinemode-series.component';
import { QcHistoryReportTableComponent } from '@app/tools/qc-history-report-module/qc-history-report-table/qc-history-report-table.component';
import { ProgressBarComponent } from 'angular-progress-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe( 'CineModeBravoComponent', () => {
    let component: CineModeBravoComponent;
    let fixture: ComponentFixture<CineModeBravoComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            imports: [
                FormsModule,
                AngularDraggableModule,
                HttpClientModule,
                RouterTestingModule,
            ],
            declarations: [
                CineModeBravoComponent,
                QcStatusEditComponent,
                DeleteCinemodeSeriesComponent,
                QcHistoryReportTableComponent,
                ProgressBarComponent,
            ],
        } ).compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( CineModeBravoComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
