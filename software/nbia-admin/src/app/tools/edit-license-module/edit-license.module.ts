import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditLicenseComponent } from './edit-license/edit-license.component';
import { DropdownModule } from 'ngx-dropdown';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { EditSiteLicenseComponent } from './edit-site-license/edit-site-license.component';
import { QuerySectionModule } from '@app/tools/query-section-module/query-section.module';



@NgModule( {
    declarations: [EditLicenseComponent, EditSiteLicenseComponent],
    exports: [
        EditLicenseComponent,
        EditSiteLicenseComponent
    ],
    imports: [
        CommonModule,
        DropdownModule,
        FormsModule,
        AngularDraggableModule,
        QuerySectionModule,

    ]
})
export class EditLicenseModule { }
