import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsSectionComponent } from './search-results-section/search-results-section.component';
import { SearchResultsTableComponent } from './search-results-section/search-results-table/search-results-table.component';
import { ShortenPipe } from './search-results-section/search-results-table/shorten.pipe';
import { ShortenRightPipe } from './search-results-section/search-results-table/shorten-right.pipe';


@NgModule( {
    declarations: [
        SearchResultsSectionComponent,
        SearchResultsTableComponent,
        SearchResultsTableComponent,
        ShortenPipe,
        ShortenRightPipe
    ],

    exports:
        [SearchResultsSectionComponent],
    imports: [
        CommonModule
    ]
} )
export class SearchResultsSectionModule{
}
