import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ToolTitleComponent } from './header/tool-title/tool-title.component';
import { AppModule } from '@app/app.module';
import { CustomMenuComponent } from './header/custom-menu/custom-menu.component';
import { UniversalMenuComponent } from './header/universal-menu/universal-menu.component';


@NgModule( {
    declarations: [HeaderComponent, ToolTitleComponent, CustomMenuComponent, UniversalMenuComponent],
    exports: [
        HeaderComponent,
        ToolTitleComponent
    ],
    imports: [
        CommonModule,

    ]
} )
export class HeaderModule{
}
