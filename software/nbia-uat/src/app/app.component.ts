import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { Config } from './configs/config';
import { ConfigService } from './configs/configservice';
import { Globals } from './conf/globals'
import { TabView, TabPanel } from 'primeng/tabview';
import { GroupComponent } from './group/group.component';
import { PeComponent } from './pe/pe.component';
import { PgComponent } from './pg/pg.component';
import { LoadingDisplayService } from './common/components/loading-display/loading-display.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
	title = 'nbia-uat';
	addedUser: any;
	config: Config[];
	errorMessage: string;
	show: boolean;
	showAuthorUG: boolean;
	showAuthorPG: boolean;
	selectedTabHeader = "User";
	version = '2.4';
	currentYear = '2024';
	commit = '5fa63f0';
	hostName:string;
	@ViewChild(TabView) tabView: TabView;
	@ViewChild(GroupComponent) groupComponent: GroupComponent;
	@ViewChild(PeComponent) peComponent: PeComponent;	
	@ViewChild(PgComponent) pgComponent: PgComponent;
	
	constructor(private appservice: ConfigService, private globals: Globals, private loadingDisplayService: LoadingDisplayService) { 	
		//uncomment below when check-in!!!
		this.globals.serviceUrl = window.location.protocol +"//"+ window.location.host+"/nbia-api/services/v3/";
		// Retrieve the access token from localStorage
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedToken) {
        this.globals.accessToken = storedToken;
    } else {
        console.error('Access token not found in localStorage.');
    }
    //this.globals.accessToken = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')[0].split('=')[1]; 
		console.log("url="+ this.globals.serviceUrl + " access token=" + this.globals.accessToken);
//		this.loadingDisplayService.setLoading( true, 'Standby...' );
		this.appservice.getWikiUrlParam().then(data => {this.globals.wikiBaseUrl = data},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
		this.appservice.getSerVerHostName().subscribe(data => {this.hostName = <string>data;
		console.log("server host name is " + this.hostName)},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
		this.appservice.getConfigParams().subscribe((config:Config[]) => {this.config = config; 
		this.show=this.config[1].paramValue.toLowerCase() == 'true';
		this.showAuthorUG = this.config[2].paramValue.toLowerCase() == 'true';
		this.showAuthorPG = this.config[3].paramValue.toLowerCase() == 'true';
		console.log("show ug = " + this.config[2].paramValue.toLowerCase() + "  show pg=" + this.config[3].paramValue.toLowerCase());
		},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
		this.version = this.globals.uatVersionNumber;	
		this.currentYear = this.globals.uatVersionYear;	
		this.commit = this.globals.uatVersionCommit;	;
	}

	ngOnInit() {
/*		
		this.appservice.getConfigParams().subscribe((config:Config[]) => {this.config = config; 
		this.show=this.config[1].paramValue.toLowerCase() == 'true';
		this.showAuthorUG = this.config[2].paramValue.toLowerCase() == 'true';
		this.showAuthorPG = this.config[3].paramValue.toLowerCase() == 'true';
		console.log("show ug = " + this.config[2].paramValue.toLowerCase() + "  show pg=" + this.config[3].paramValue.toLowerCase());
		},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
*/
	}

	pushNewUser(loginName) {
		this.addedUser = loginName;
	}

	handleError (error: any) {
		let errMsg = error.message || 'Server error';
		console.error(errMsg); // log to console instead
		return Promise.reject(errMsg);
	}

	handleChange(e) {
		//this.selectedTabIndex = e.index;
		console.log("selected tab index="+ e.index);
		//console.log(this.tabView.tabs[this.selectedTabIndex].header);
		this.selectedTabHeader = this.tabView.tabs[e.index].header;
		console.log(this.selectedTabHeader);
		if (this.tabView.tabs[e.index].header == "Protection Group")
			this.pgComponent.ngOnInit();
		
		if (this.tabView.tabs[e.index].header == "Protection Element")
			this.peComponent.ngOnInit();
		
		if (this.tabView.tabs[e.index].header == "User Group")
			this.groupComponent.ngOnInit();		
			
		if (this.tabView.tabs[e.index].header == "Protection Element" && this.peComponent.loadingComplete == false)
			this.loadingDisplayService.setLoading( true, 'Loading existing collection and site data...' );
		
		if (this.tabView.tabs[e.index].header == "Protection Group" && this.pgComponent.loadingComplete == false) {
			this.loadingDisplayService.setLoading( true, 'Loading protection group data...' );
		}
		
		if (this.tabView.tabs[e.index].header == "User Group" && this.groupComponent.loadingComplete == false)
			this.loadingDisplayService.setLoading( true, 'Loading user group data...' );		
	}
}
