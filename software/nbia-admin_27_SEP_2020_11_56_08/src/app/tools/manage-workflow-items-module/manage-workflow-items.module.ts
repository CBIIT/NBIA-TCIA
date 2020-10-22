import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageWorkflowItemsComponent } from './manage-workflow-items/manage-workflow-items.component';


@NgModule( {
    declarations: [ManageWorkflowItemsComponent],
    exports: [ManageWorkflowItemsComponent],
    imports: [
        CommonModule
    ]
} )

export class ManageWorkflowItemsModule{
}
