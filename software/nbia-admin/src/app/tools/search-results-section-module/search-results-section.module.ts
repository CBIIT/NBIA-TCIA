import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsSectionComponent } from './search-results-section/search-results-section.component';
import { AdminCommonPipeModule } from '@app/admin-common/admin-common-pipe-module/admin-common-pipe.module';
import { FormsModule } from '@angular/forms';
import { SearchResultsSectionBravoComponent } from './search-results-section-bravo/search-results-section-bravo.component';
import { SearchResultsSectionCharlieComponent } from './search-results-section-charlie/search-results-section-charlie.component';
import { EditLicenseModule } from '@app/tools/edit-license-module/edit-license.module';
import { NgxKeyboardShortcutModule } from 'ngx-keyboard-shortcuts';


@NgModule( {
    declarations: [
        SearchResultsSectionComponent,
        SearchResultsSectionBravoComponent,
        SearchResultsSectionCharlieComponent
    ],

    exports: [
        SearchResultsSectionComponent,
        SearchResultsSectionBravoComponent,
        SearchResultsSectionCharlieComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        AdminCommonPipeModule,
        NgxKeyboardShortcutModule.forRoot()
    ]
} )
export class SearchResultsSectionModule{
}
