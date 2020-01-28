import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NbiaUatComponent } from './nbia-uat/nbia-uat.component';

const routes: Routes = [
	{ path: 'nbia-uat', component: NbiaUatComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
