import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditLicenseComponent } from './edit-license/edit-license.component';
import { DropdownModule } from 'ngx-dropdown';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';



@NgModule( {
    declarations: [EditLicenseComponent],
    exports: [
        EditLicenseComponent
    ],
    imports: [
        CommonModule,
        DropdownModule,
        FormsModule,
        AngularDraggableModule,

    ]
})
export class EditLicenseModule { }
