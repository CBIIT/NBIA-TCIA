import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformOnlineDeletionComponent } from './perform-online-deletion/perform-online-deletion.component';



@NgModule( {
    declarations: [PerformOnlineDeletionComponent],
    exports: [
        PerformOnlineDeletionComponent
    ],
    imports: [
        CommonModule
    ]
})
export class PerformOnlineDeletionModule { }
