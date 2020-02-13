import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApproveDeletionsComponent } from './approve-deletions/approve-deletions.component';
import { QcToolModule } from '../qc-tool-module/qc-tool.module';
import { AppModule } from '../../app.module';
import { QuerySectionModule } from '../query-section-module/query-section.module';
import { DisplayQueryModule } from '../display-query-module/display-query.module';
import { SearchResultsSectionModule } from '../search-results-section-module/search-results-section.module';


@NgModule( {
    declarations: [ApproveDeletionsComponent],
    exports: [ApproveDeletionsComponent],
    imports: [
        CommonModule,
        QuerySectionModule,
        DisplayQueryModule,
        SearchResultsSectionModule
    ]
} )

export class ApproveDeletionsModule{
}
