/// <reference path="../node_modules/angular2/typings/browser.d.ts" />

import {Component, Input} from 'angular2/core';
import {UserComponent} from "./user.component"
import {PgComponent} from "./pg.component"
import {GroupComponent} from "./group.component"
import {PgRoleComponent} from "./pgRole.component"
import {TabView} from 'primeng/primeng';
import {TabPanel} from 'primeng/primeng';
import myGlobals = require('./conf/globals');

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
	directives: [UserComponent,PgComponent,GroupComponent,PgRoleComponent,TabView,TabPanel]
})


export class AppComponent {	
	private addedUser: any;
	
	constructor() {
	  myGlobals.accessToken = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')[0].split('=')[1]; 
//uncomment the below statement when check in!!! Comment it out for using it for hot deployment with gulp in development setting
	  myGlobals.serviceUrl = window.location.protocol +"//"+ window.location.host+"/nbia-api/services/v3/"; 

    }
	
	private pushNewUser(loginName) {
		this.addedUser = loginName;
    }
}
