import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommonPipeModule } from '@app/admin-common/admin-common-pipe-module/admin-common-pipe.module';
import { FormsModule } from '@angular/forms';
import { SearchResultsSectionBravoComponent } from './search-results-section-bravo/search-results-section-bravo.component';
import { EditLicenseModule } from '@app/tools/edit-license-module/edit-license.module';
import { SearchResultsPagerComponent } from './search-results-pager/search-results-pager.component';
import { RemoveSitePipe } from './search-results-section-bravo/remove-site.pipe';


@NgModule( {
    declarations: [
        SearchResultsSectionBravoComponent,
        SearchResultsPagerComponent,
        RemoveSitePipe
    ],

    exports: [
        SearchResultsSectionBravoComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        AdminCommonPipeModule,
    ]
} )
export class SearchResultsSectionModule{
}
