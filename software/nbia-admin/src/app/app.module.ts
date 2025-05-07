import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NbiaAdminClientComponent } from './nbia-admin-client/nbia-admin-client.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from './header-module/header.module';
import { EditCollectionDescriptionsModule } from './tools/edit-collection-descriptions-module/edit-collection-descriptions.module';
import { ViewSubmissionReportsModule } from './tools/view-submission-reports-module/view-submission-reports.module';
import { PerformOnlineDeletionModule } from './tools/perform-online-deletion-module/perform-online-deletion.module';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AccessTokenService } from './admin-common/services/access-token.service';
import { ApproveDeletionsModule } from './tools/approve-deletions-module/approve-deletions.module';
import { PerformQcModule } from './tools/perform-qc-module/perform-qc.module';
import { QuerySectionModule } from './tools/query-section-module/query-section.module';
import { ManageWorkflowItemsModule } from './tools/manage-workflow-items-module/manage-workflow-items.module';
import { CookieService } from 'ngx-cookie-service';
import { LoadingDisplayComponent } from './admin-common/components/loading-display/loading-display.component';
import { FooterComponent } from './footer/footer.component';
import { EditLicenseModule } from '@app/tools/edit-license-module/edit-license.module';
import { CineModeModule } from '@app/tools/cine-mode-module/cine-mode.module';
import { PreferencesComponent } from './preferences/preferences.component';
import { DynamicQueryTestModule } from '@app/tools/dynamic-query-test-module/dynamic-query-test.module';
import { CriteriaSelectionMenuComponent } from './criteria-selection-menu/criteria-selection-menu.component';
import { SearchResultsSectionModule } from '@app/tools/search-results-section-module/search-results-section.module';
import { ConfigurationService } from './admin-common/services/configuration.service';
import { CineModeBravoComponent } from '@app/tools/cine-mode-module/cine-mode-bravo/cine-mode-bravo.component';

export function initSharedConfig(configService: ConfigurationService) {
    return () => configService.loadSharedConfig();
  }

@NgModule( {
    declarations: [
        AppComponent,
        NbiaAdminClientComponent,
        LoginComponent,
        LoadingDisplayComponent,
        FooterComponent,
        PreferencesComponent,
        CriteriaSelectionMenuComponent
    ],
    exports: [],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        EditCollectionDescriptionsModule,
        HttpClientModule,
        HeaderModule,
        ViewSubmissionReportsModule,
        PerformOnlineDeletionModule,
        CineModeModule,
        QuerySectionModule,
        ApproveDeletionsModule,
        PerformQcModule,
        ManageWorkflowItemsModule,
        EditLicenseModule,
        DynamicQueryTestModule,
        SearchResultsSectionModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initSharedConfig,
            deps: [ConfigurationService],
            multi: true
          },
        AccessTokenService,
        CookieService
    ],
    bootstrap: [AppComponent]
} )
export class AppModule{
}
