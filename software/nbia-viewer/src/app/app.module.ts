import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { TestAlphaComponent } from './test-alpha/test-alpha.component';
import { NbiaThumbnailViewerComponent } from './nbia-thumbnail-viewer/nbia-thumbnail-viewer.component';
import { FooterComponent } from './footer/footer.component';
import { ImagesPerPageComponent } from './images-per-page/images-per-page.component';
import { PagerComponent } from './pager/pager.component';
import {CookieService} from "ngx-cookie-service";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    TestAlphaComponent,
    NbiaThumbnailViewerComponent,
    FooterComponent,
    ImagesPerPageComponent,
    PagerComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        AppRoutingModule,
        FormsModule
    ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
