import { Component, Input, ViewChild, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { Table } from 'primeng/table';
import { SelectItem } from 'primeng/api';
import { Config } from '../configs/config';
import { ConfigService } from '../configs/configservice';
import { Globals } from '../conf/globals'
import { PgRole } from './pgRole';
import { PgRoleService } from './pgRoleservice';

@Component({
  selector: 'pgRole',
  templateUrl: './pgRole.component.html',
  styleUrls: ['./pgRole.component.scss'],
  providers:  [Globals, ConfirmationService]    
})
export class PgRoleComponent implements OnInit {
	@Input() addedUser: any;
	@ViewChild(Table, {static: false}) 
	private dt:Table;
	displayDialog: boolean;
	displayDialogAdd: boolean;
	userNames: SelectItem[];
	errorMessage: string;
	statusMessage: Message[] = [];
	selectedUserName: string;
	pgRoles: PgRole[];
	pgRole: PgRole;
	pgSize: number;
	allRoles: SelectItem[] =[];
	srs: string[] = [];
	availablePGs: SelectItem[] =[];
	selectedPGs: SelectItem[] =[];
	selectedGroupNames: string[] = [];
	availableGroups:SelectItem[] =[];
	selectedPGName: string;
	newPgRole: boolean;
	selectedPgRole: PgRole;
	postData: string;
	wikiLink: string;
	searchInProgress:boolean;
	showUserGroup:boolean;
	groups: any;
	
  constructor(private appservice: ConfigService, private pgRoleService: PgRoleService, private globals: Globals, private confirmationService: ConfirmationService) { 
    if (this.globals.wikiBaseUrl === "") {
		this.appservice.getWikiUrlParam().then(data => {this.globals.wikiBaseUrl = data; 
		this.wikiLink = this.globals.wikiBaseUrl + this.globals.userAuthorizationWiki},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
	}
	else this.wikiLink = this.globals.wikiBaseUrl + this.globals.userAuthorizationWiki; 
	this.appservice.getUserAthorParam().then(data => {this.showUserGroup = data; console.log("get user autor option="+ this.showUserGroup); },
	error =>  {this.handleError(error);this.errorMessage = <any>error});	
  }

  ngOnInit() {
		this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Loading data...'});
		this.userNames = [];
		this.userNames.push({label:'Select User', value:''});	
		this.pgRoleService.getUserNames().
		subscribe(userNames => {this.userNames = <SelectItem[]>userNames; this.statusMessage = [];
//		this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Please select a user from above drop down list and click on it.'});
		}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});

		this.selectedUserName = null;
		
		this.availablePGs = [];
		this.availablePGs.push({label:'Choose', value:''});
		
		this.allRoles = [];
		this.statusMessage = [];	
  }

	getPgRolesForUser() {
		if (this.showUserGroup === true) {
			console.log("group enabled: will show user group association:"+this.selectedUserName );
			this.statusMessage = [];
			this.groups = [];
			this.pgRoleService.getGroupsForUser(this.selectedUserName).
			subscribe((groups:any) => {
			this.groups = groups; 
//			this.pgSize = this.pgRoles.length; 
//			this.searchInProgress=false;
			}, 
			error =>  {this.handleError(error);this.errorMessage = <any>error});
		}
		else {
			console.log("pg enabled: will show pg role association");
						
			this.searchInProgress = true;
			this.statusMessage = [];
			this.pgRoles = [];
			this.pgSize = 0;
			this.pgRoleService.getPgRolesForUser(this.selectedUserName).
			subscribe((pgRoles:PgRole[]) => {
			this.pgRoles = pgRoles; 
			this.pgSize = this.pgRoles.length; 
			this.searchInProgress=false;
			}, 
			error =>  {this.handleError(error);this.errorMessage = <any>error});
		}
	}
	
	ngOnChanges(changes: any[]) {
		var newLogin = changes['addedUser'].currentValue; 
		if (newLogin) {
			this.userNames.push({label: newLogin, value: newLogin});
		}
	}
	
    showDialogToAdd() {
        this.newPgRole = true;
        this.pgRole = new PrimePgRole();
		this.selectedPGName = null;		
		this.pgRoleService.getAvailablePGs(this.selectedUserName).subscribe((availablePGs:SelectItem[]) => {
		this.availablePGs = availablePGs;
		// a workaround to show the choose as the initial tool tip as the dropdown box dose not provide it
		this.availablePGs.unshift({label:'Choose', value:''});
		}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});		
		
		this.srs = [];
		this.pgRoleService.getAllRoles().subscribe((allRoles:SelectItem[]) => {
		this.allRoles = allRoles;
		this.displayDialog = true;
		}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});
	}
	
    showDialogToAddGroup() {
//        this.newPgRole = true;
//        this.pgRole = new PrimePgRole();
		this.selectedGroupNames = [];		
		this.pgRoleService.getAvailableGroups(this.selectedUserName).subscribe((availableGroups:SelectItem[]) => {
		this.availableGroups = availableGroups;
		// a workaround to show the choose as the initial tool tip as the dropdown box dose not provide it
		//this.availableGroups.unshift({label:'Choose', value:''});
		this.displayDialogAdd = true;
		}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});		
		
		//this.srs = [];
		//this.pgRoleService.getAllRoles().subscribe((allRoles:SelectItem[]) => {
		//this.allRoles = allRoles;
		//this.displayDialogAdd = true;
		//}, 
		//error =>  {this.handleError(error);this.errorMessage = <any>error});
	}	
	
    showDialogToUpdate(pgRole) {
        this.newPgRole = false;
		this.selectedPGName = pgRole.pgName;
        this.pgRole = this.clonePgRole(pgRole);
		this.selectedPgRole = pgRole;
		this.pgRoleService.getAllRoles().subscribe((allRoles:SelectItem[]) => {
		this.allRoles = allRoles;
		this.srs = pgRole.roleNames.split(", ");
		this.displayDialog = true;
		}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});
    }
	
    confirmDeletion(groupName) {
		console.log("confirm the deletion for group " + groupName);
        this.confirmationService.confirm({
            message: 'Do you want to remove the user from group ' + groupName + '?',
            header: 'Deassign Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
				this.pgRoleService.removeUserFromGroup(this.selectedUserName, groupName)
				.subscribe(
				data => {this.postData = JSON.stringify(data)},
				error =>  {this.handleError(error);this.errorMessage = <any>error;this.refreshTable()},
				() => {console.log("Finished");this.refreshTable()}
				);
				this.groups.splice(this.findSelectedGroupIndex(groupName), 1);
				this.statusMessage = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
            },
            reject: () => {
                this.statusMessage = [{severity:'info', summary:'Info', detail:'No action performed.'}];
            }
        });
    }	

	clonePgRole(u: PgRole): PgRole {
		let pgRole = new PrimePgRole();
		for(let prop in u) {
			pgRole[prop] = u[prop];
		}
		return pgRole;
    }
	
    findSelectedPgRoleIndex(): number {
        return this.pgRoles.indexOf(this.selectedPgRole);
    }
	
    findSelectedGroupIndex(groupName): number {
		var index = this.groups.findIndex(function(item, i){
			return item.GroupName === groupName
		});
		console.log("groupName=" + groupName + " index="+ index);
       // return this.groups.indexOf({GroupName: groupName});
	   return index;
    }	

    save() {
		this.statusMessage = [];
        if(this.newPgRole) {
			this.pgRoleService.addNewPgRoleForUser(this.selectedUserName, this.selectedPGName, this.srs)
			.subscribe(
				data => this.postData = JSON.stringify(data),
				error =>  {this.handleError(error);this.errorMessage = <any>error;this.refreshTable()},
				() => console.log("Finished")
			);
			let aPgRole = new PrimePgRole();
			aPgRole.pgName = this.selectedPGName;
			aPgRole.roleNames = this.srs.join(", ");
			//this.pgRoles.push(new PrimePgRole(this.selectedPGName, this.srs.join(", ")));
			this.pgRoles.push(aPgRole);
			this.pgSize = this.pgSize +1;
		}

        this.newPgRole = null;
        this.displayDialog = false;
    }
	
    saveGroup() {
		this.statusMessage = [];
		this.pgRoleService.addNewGroupForUser(this.selectedUserName, this.selectedGroupNames)
		.subscribe(
			data => {this.postData = JSON.stringify(data);
			},
			error =>  {this.handleError(error);this.errorMessage = <any>error;this.refreshTable()},
			() => console.log("Finished")
		);
		for(let i=0; i<(this.selectedGroupNames).length; i++) {
			this.groups.push({GroupName: this.selectedGroupNames[i]});
		}

        this.displayDialogAdd = false;
    }	
	
	delete(){
		this.statusMessage = [];
		this.pgRoleService.removeUserFromPG(this.selectedUserName, this.selectedPGName)
		.subscribe(
			data => this.postData = JSON.stringify(data),
			error =>  {this.handleError(error);this.errorMessage = <any>error;this.refreshTable()},
			() => {console.log("Finished");this.refreshTable()}
		);
        this.pgRoles.splice(this.findSelectedPgRoleIndex(), 1);
        this.pgRole = null;
        this.displayDialog = false;
	}
	
	update() {
		this.statusMessage = [];
		this.pgRoleService.modifyRolesOfUserForPG(this.selectedUserName, this.selectedPGName, this.srs)
		.subscribe(
		data => this.postData = JSON.stringify(data),
		error =>  {this.handleError(error);this.errorMessage = <any>error;this.refreshTable()},
		() => {console.log("Finished");this.refreshTable()}
			);
        this.pgRole.roleNames = this.srs.join(", ");
		this.pgRoles[this.findSelectedPgRoleIndex()] = this.pgRole;	
        this.displayDialog = false;	
	}

	private handleError (error: any) {
		this.statusMessage = [];
		
		if (error.status==500) {
			this.statusMessage.push({severity:'error', summary:'Error: ', detail:'No data found from server.'});
		}
		else if (error.status == 401) {		
			this.statusMessage.push({severity:'error', summary:'Error: ', detail:'Session expired. Please login again.'});
		}
		else if (error.status == 200) {
			this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Request sent to server.'});
		}
		else if (error.status == undefined){
			this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Sent.'});
		}
		else {
			this.statusMessage.push({severity:'error', summary:'Error: ', detail:'Error occured while retriving data from server. Check the server connection please. Error code: '+error.status});
		}
		this.searchInProgress = false;
	}	
	
	refreshTable() {
		this.dt.reset(); 
	}
  
	openWiki() {
		window.open(this.wikiLink,'wiki');
  }
	
}

class PrimePgRole implements PgRole {
	pgName: string;
	roleNames: string;
   // constructor(public pgName?, public roleNames?) {}
}

