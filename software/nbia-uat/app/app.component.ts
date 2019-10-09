/// <reference path="../node_modules/angular2/typings/browser.d.ts" />

import {Component, Input} from 'angular2/core';
import {UserComponent} from "./user.component"
import {PeComponent} from "./pe.component"
import {PgComponent} from "./pg.component"
import {GroupComponent} from "./group.component"
import {PgRoleComponent} from "./pgRole.component"
import {TabView} from 'primeng/primeng';
import {TabPanel,Messages} from 'primeng/primeng';
//import {Http, Response} from 'angular2/http';
import {HTTP_PROVIDERS} from 'angular2/http';
//import {Headers} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import myGlobals = require('./conf/globals');
import {ConfigService,Config} from './configs/configservice';

	@Component({
    selector: 'my-app',
              styles: [ `
    .colorLG {
      background: linear-gradient(to right, #99ccff 0%, #003366 100%);
                width: 100%;
    }
  `],
    template: `
	<table width="100%" 
       border="0" 
       cellspacing="0" 
       cellpadding="0"
	   background="app/images/headbackGround.jpg"
       align="center" >
        <tr>      
			<td valign="center" align="right" style="padding-right: 100px;">
				<span class="fontSize24 TextShadow blue mediumFont dispBlock" >User Authorization Tool&nbsp;&nbsp;</span>
			</td> 
		</tr>
	</table>


	<p-tabView>
    <p-tabPanel header="User">
		<user (addUser)="pushNewUser($event)"></user>
	</p-tabPanel>
	<div *ngIf="show">
		<p-tabPanel header="Protection Element">
			<pe></pe>
		</p-tabPanel>
	</div>	
    <p-tabPanel header="Protection Group">
        <pg></pg>
    </p-tabPanel>
    <p-tabPanel header="User Group">
	   <group></group>
    </p-tabPanel>	
    <p-tabPanel header="User Authorization">
	   <pgRole [addedUser]="addedUser"></pgRole>
    </p-tabPanel>	
	`,
	directives: [UserComponent,PeComponent,PgComponent,GroupComponent,PgRoleComponent,TabView,TabPanel,Messages],
	providers: [HTTP_PROVIDERS,ConfigService]
})


export class AppComponent {	
	private addedUser: any;
	config: Config[];
	errorMessage: string;
	show: boolean;	

	constructor(private appservice: ConfigService) {
//	  myGlobals.accessToken = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')[0].split('=')[1];
	  this.show = false;

//uncomment the below statement when check in!!! Comment it out for using it for hot deployment with gulp in development setting
	  myGlobals.serviceUrl = window.location.protocol +"//"+ window.location.host+"/nbia-api/services/v3/"; 
	}

	ngOnInit() {
		this.appservice.getConfigParams().then(config => {this.config = config; 
		this.show=this.config[1].paramValue.toLowerCase() == 'true';
		},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
	}	
	
	private pushNewUser(loginName) {
		this.addedUser = loginName;
    }

	private handleError (error: any) {
		let errMsg = error.message || 'Server error';
		console.error(errMsg); // log to console instead
		return Promise.reject(errMsg);
	}
}

