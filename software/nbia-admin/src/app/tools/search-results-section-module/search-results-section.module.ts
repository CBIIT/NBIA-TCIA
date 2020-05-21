import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsSectionComponent } from './search-results-section/search-results-section.component';
import { AdminCommonPipeModule } from '@app/admin-common/admin-common-pipe-module/admin-common-pipe.module';
import { FormsModule } from '@angular/forms';
import { SearchResultsSectionBravoComponent } from './search-results-section-bravo/search-results-section-bravo.component';


@NgModule( {
    declarations: [
        SearchResultsSectionComponent,
        SearchResultsSectionBravoComponent
    ],

    exports: [
        SearchResultsSectionComponent,
        SearchResultsSectionBravoComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        AdminCommonPipeModule
    ]
} )
export class SearchResultsSectionModule{
}
