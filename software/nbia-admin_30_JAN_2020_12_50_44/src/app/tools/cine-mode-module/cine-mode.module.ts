import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CineModeComponent } from './cine-mode/cine-mode.component';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';


@NgModule( {
    declarations: [
        CineModeComponent
    ],
    exports: [
        CineModeComponent
    ],
    imports: [
        CommonModule,
        AngularDraggableModule,
        FormsModule

    ]
} )
export class CineModeModule{
}
