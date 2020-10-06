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
import { PerformQcModule } from './tools/perform-qc-module/perform-qc.module';
import { QuerySectionModule } from './tools/query-section-module/query-section.module';
import { ManageWorkflowItemsModule } from './tools/manage-workflow-items-module/manage-workflow-items.module';
import { CookieService } from 'angular2-cookie/core';
import { LoadingDisplayComponent } from './admin-common/components/loading-display/loading-display.component';
import { FooterComponent } from './footer/footer.component';
import { EditLicenseModule } from '@app/tools/edit-license-module/edit-license.module';
import { CineModeModule } from '@app/tools/cine-mode-module/cine-mode.module';
import { NgxKeyboardShortcutModule } from 'ngx-keyboard-shortcuts';
import { PreferencesComponent } from './preferences/preferences.component';

@NgModule( {
    declarations: [
        AppComponent,
        NbiaAdminClientComponent,
        LoginComponent,
        LoadingDisplayComponent,
        FooterComponent,
        PreferencesComponent
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
        CineModeModule,
        QuerySectionModule,
        ApproveDeletionsModule,
        PerformQcModule,
        ManageWorkflowItemsModule,
        EditLicenseModule,
        NgxKeyboardShortcutModule.forRoot()
    ],
    providers: [
        AccessTokenService,
        CookieService
    ],
    bootstrap: [AppComponent]
} )
export class AppModule{
}
