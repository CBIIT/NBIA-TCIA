import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApproveDeletionsComponent } from './approve-deletions/approve-deletions.component';
import { QuerySectionModule } from '../query-section-module/query-section.module';
import { DisplayQueryModule } from '../display-query-module/display-query.module';
import { SearchResultsSectionModule } from '../search-results-section-module/search-results-section.module';
import { DeletionBulkOperationsComponent } from '@app/tools/approve-deletions-module/approve-deletions/deletion-bulk-operations/deletion-bulk-operations.component';
import { FormsModule } from '@angular/forms';


@NgModule( {
    declarations: [ApproveDeletionsComponent, DeletionBulkOperationsComponent],
    exports: [ApproveDeletionsComponent],
    imports: [
        CommonModule,
        QuerySectionModule,
        DisplayQueryModule,
        SearchResultsSectionModule,
        FormsModule,
    ]
} )

export class ApproveDeletionsModule{
}
