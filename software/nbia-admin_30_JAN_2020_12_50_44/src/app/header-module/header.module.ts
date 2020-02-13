import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ToolTitleComponent } from './header/tool-title/tool-title.component';


@NgModule( {
    declarations: [HeaderComponent, ToolTitleComponent],
    exports: [
        HeaderComponent,
        ToolTitleComponent
    ],
    imports: [
        CommonModule
    ]
} )
export class HeaderModule{
}
