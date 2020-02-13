import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NbiaAdminClientComponent } from './nbia-admin-client/nbia-admin-client.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from './header-module/header.module';
import { EditCollectionDescriptionsModule } from './tools/edit-collection-descriptions-module/edit-collection-descriptions.module';
import { ViewSubmissionReportsModule } from './tools/view-submission-reports-module/view-submission-reports.module';
import { PerformOnlineDeletionModule } from './tools/perform-online-deletion-module/perform-online-deletion.module';
import { FormsModule } from '@angular/forms';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { MomentModule } from 'ngx-moment';
import { LoginComponent } from './login/login.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { AccessTokenService } from './admin-common/services/access-token.service';
import { ApproveDeletionsModule } from './tools/approve-deletions-module/approve-deletions.module';
import { QcToolModule } from './tools/qc-tool-module/qc-tool.module';
import { QuerySectionModule } from './tools/query-section-module/query-section.module';

@NgModule( {
    declarations: [
        AppComponent,
        NbiaAdminClientComponent,
        LoginComponent
    ],
    exports: [
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        EditCollectionDescriptionsModule,
        HttpClientModule,
        HeaderModule,
        ViewSubmissionReportsModule,
        NgxMyDatePickerModule.forRoot(),
        PerformOnlineDeletionModule,
        MomentModule,
        AngularDraggableModule,

        QuerySectionModule,
        ApproveDeletionsModule,
        QcToolModule,
    ],
    providers: [AccessTokenService],
    bootstrap: [AppComponent]
} )
export class AppModule{
}
