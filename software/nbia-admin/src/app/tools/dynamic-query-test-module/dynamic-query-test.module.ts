import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicQueryTestComponent } from './dynamic-query-test/dynamic-query-test.component';
import { QuerySectionModule } from '@app/tools/query-section-module/query-section.module';
import { CleanDynamicSearchTestJsonPipe } from './clean-dynamic-search-test-json.pipe';


@NgModule( {
    declarations: [DynamicQueryTestComponent, CleanDynamicSearchTestJsonPipe],
    exports: [DynamicQueryTestComponent],
    imports: [
        CommonModule,
        QuerySectionModule
    ]
} )
export class DynamicQueryTestModule{
}
