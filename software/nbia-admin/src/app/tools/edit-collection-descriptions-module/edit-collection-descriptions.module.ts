import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCollectionDescriptionsComponent } from './edit-collection-descriptions/edit-collection-descriptions.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';
import {  DropdownModule } from 'ngx-dropdown';


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
        DropdownModule
    ]
} )
export class EditCollectionDescriptionsModule{
}
