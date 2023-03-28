import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NbiaThumbnailViewerComponent} from "./nbia-thumbnail-viewer/nbia-thumbnail-viewer.component";

const routes: Routes = [
  { path: '', component: NbiaThumbnailViewerComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
