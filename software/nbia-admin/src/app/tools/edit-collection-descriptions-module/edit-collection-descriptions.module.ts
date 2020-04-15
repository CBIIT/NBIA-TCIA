import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCollectionDescriptionsComponent } from './edit-collection-descriptions/edit-collection-descriptions.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';
import {  DropdownModule } from 'ngx-dropdown';
import { QuerySectionModule } from '../query-section-module/query-section.module';
import { DisplayQueryModule } from '../display-query-module/display-query.module';
import { SearchResultsSectionModule } from '../search-results-section-module/search-results-section.module';


@NgModule( {
    declarations: [EditCollectionDescriptionsComponent],
    exports: [
        EditCollectionDescriptionsComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        AngularEditorModule,
        FormsModule,
        QuerySectionModule,
        DropdownModule,

        DisplayQueryModule,
        SearchResultsSectionModule
    ]
} )
export class EditCollectionDescriptionsModule{
}
