import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule, Routes } from '@angular/router';
import { NbiaThumbnailViewerComponent } from './nbia-thumbnail-viewer/nbia-thumbnail-viewer.component';
import { HttpClientModule } from '@angular/common/http';
import { UtilService } from './services/util.service';
import { ServerAccessService } from './services/server-access.service';
import { FormsModule } from '@angular/forms';
import { PagerComponent } from './pager/pager.component';
import { CommonService } from './services/common.service';
import { ImagesPerPageComponent } from './images-per-page/images-per-page.component';
import { FooterComponent } from './footer/footer.component';


const appRoutes: Routes = [
    { path: '', component: NbiaThumbnailViewerComponent }
];


@NgModule( {
    declarations: [
        AppComponent,
        NbiaThumbnailViewerComponent,
        PagerComponent,
        ImagesPerPageComponent,
        FooterComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot( appRoutes ),
    ],
    providers: [
        CookieService,
        UtilService,
        ServerAccessService,
        CommonService
    ],
    bootstrap: [AppComponent]
} )
export class AppModule{
}
