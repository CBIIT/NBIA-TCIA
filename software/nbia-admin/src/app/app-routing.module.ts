import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NbiaAdminClientComponent } from './nbia-admin-client/nbia-admin-client.component';


const routes: Routes = [
  { path: '', component: NbiaAdminClientComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
