import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayDynamicQueryComponent } from './display-dynamic-query/display-dynamic-query.component';



@NgModule( {
    declarations: [DisplayDynamicQueryComponent],
    exports: [
        DisplayDynamicQueryComponent
    ],
    imports: [
        CommonModule
    ]
})
export class DisplayDynamicQueryModule { }
