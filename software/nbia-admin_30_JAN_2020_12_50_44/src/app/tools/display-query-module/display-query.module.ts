import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayQueryComponent } from './display-query/display-query.component';


@NgModule( {
    declarations: [
        DisplayQueryComponent
    ],
    exports: [
        DisplayQueryComponent
    ],
    imports: [
        CommonModule
    ]
} )
export class DisplayQueryModule{
}
