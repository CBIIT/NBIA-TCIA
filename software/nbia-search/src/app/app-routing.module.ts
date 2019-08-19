import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NbiaClientComponent } from '@app/nbia-client/nbia-client.component';


const appRoutes: Routes = [
    { path: '', component: NbiaClientComponent },
    // The following are for backwards compatibility.
    { path: 'login.jsf', component: NbiaClientComponent },
    { path: 'ncia/login.jsf', component: NbiaClientComponent },
    { path: 'search', component: NbiaClientComponent },
    { path: 'externalLinks.jsf', component: NbiaClientComponent },
    { path: 'ncia/externalLinks.jsf', component: NbiaClientComponent },
    { path: 'externalPatientSearch.jsf', component: NbiaClientComponent },
    { path: 'ncia/externalPatientSearch.jsf', component: NbiaClientComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
