import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommonPipeModule } from '@app/admin-common/admin-common-pipe-module/admin-common-pipe.module';
import { FormsModule } from '@angular/forms';
import { SearchResultsSectionBravoComponent } from './search-results-section-bravo/search-results-section-bravo.component';
import { EditLicenseModule } from '@app/tools/edit-license-module/edit-license.module';
import { NgxKeyboardShortcutModule } from 'ngx-keyboard-shortcuts';
import { SearchResultsPagerComponent } from './search-results-pager/search-results-pager.component';


@NgModule( {
    declarations: [
        SearchResultsSectionBravoComponent,
        SearchResultsPagerComponent
    ],

    exports: [
        SearchResultsSectionBravoComponent
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
