import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { ProgressBarModule } from 'angular-progress-bar';
import { QcStatusEditComponent } from './qc-status-edit/qc-status-edit.component';
import { AdminCommonPipeModule } from '@app/admin-common/admin-common-pipe-module/admin-common-pipe.module';
import { QcHistoryReportModuleModule } from '../qc-history-report-module/qc-history-report-module.module';
import { DeleteCinemodeSeriesComponent } from './delete-cinemode-series/delete-cinemode-series.component';
import { CineModeBravoComponent } from './cine-mode-bravo/cine-mode-bravo.component';


@NgModule( {
    declarations: [
        QcStatusEditComponent,
        DeleteCinemodeSeriesComponent,
        CineModeBravoComponent,
    ],
    exports: [
        CineModeBravoComponent,
    ],
    imports: [
        CommonModule,
        AngularDraggableModule,
        FormsModule,
        ProgressBarModule,
        AdminCommonPipeModule,
        QcHistoryReportModuleModule
    ]
} )
export class CineModeModule{
}
