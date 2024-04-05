import { Component, Input, ViewChild, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { SelectItem } from 'primeng/api';
import { Config } from '../configs/config';
import { ConfigService } from '../configs/configservice';
import { Globals } from '../conf/globals'
import { UserToGroupService } from './userToGroupservice';

@Component({
  selector: 'userToGroup',
  templateUrl: './userToGroup.component.html',
  styleUrls: ['./userToGroup.component.scss'],
  providers:  [Globals, ConfirmationService]    
})
export class UserToGroupComponent implements OnInit {
	@Input() addedUser: any;
	@ViewChild(Table) 
	private dt:Table;
	displayDialogAdd: boolean;
	userNames: SelectItem[];
	errorMessage: string;
	statusMessage: Message[] = [];
	selectedUserName: string;
	selectedGroupNames: string[] = [];
	availableGroups:SelectItem[] =[];
	postData: string;
	wikiLink: string;
	showUserGroup:boolean;
	groups: any;
	
  constructor(private appservice: ConfigService, private userToGroupService: UserToGroupService, private globals: Globals, private confirmationService: ConfirmationService) { 
    if (this.globals.wikiBaseUrl === "") {
		this.appservice.getWikiUrlParam().then(data => {this.globals.wikiBaseUrl = data; 
		this.wikiLink = this.globals.wikiBaseUrl + this.globals.userAuthorizationWithGroupWiki},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
	}
	else this.wikiLink = this.globals.wikiBaseUrl + this.globals.userAuthorizationWithGroupWiki; 
	this.appservice.getUserAthorParam().then(data => {this.showUserGroup = data; console.log("get user autor option="+ this.showUserGroup); },
	error =>  {this.handleError(error);this.errorMessage = <any>error});	
  }

  ngOnInit() {
		this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Loading data...'});
    console.log("place 2")
		this.userNames = [];
		this.userNames.push({label:'Select User', value:''});	
		this.userToGroupService.getUserNames().
		subscribe((userNames: SelectItem[])  => {
      this.userNames = userNames.map(item => ({
      label: String(item.label),
      value: item.value
      }));

    this.statusMessage = [];
		this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Please select a user from above drop down list and click on it.'});
		}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});

    console.log(this.userNames)
		this.selectedUserName = null;
		this.statusMessage = [];	
  }

	getGroupsForUser() {
		if (this.showUserGroup === true) {
			console.log("group enabled: will show user group association:"+this.selectedUserName );
			this.statusMessage = [];
			this.groups = [];
			this.userToGroupService.getGroupsForUser(this.selectedUserName).
			subscribe((groups:any) => {
			this.groups = groups; 
			}, 
			error =>  {this.handleError(error);this.errorMessage = <any>error});
		}
	}
	
	ngOnChanges(changes: any[]) {
		var newLogin = changes['addedUser'].currentValue; 
		if (newLogin) {
      console.log("place 1")
			this.userNames.push({label: newLogin, value: newLogin});
		}
	}
	

    showDialogToAddGroup() {
		this.selectedGroupNames = [];		
		this.userToGroupService.getAvailableGroups(this.selectedUserName).subscribe((availableGroups:SelectItem[]) => {
		this.availableGroups = availableGroups;
		this.displayDialogAdd = true;
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
				this.userToGroupService.removeUserFromGroup(this.selectedUserName, groupName)
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

    findSelectedGroupIndex(groupName): number {
		var index = this.groups.findIndex(function(item, i){
			return item.GroupName === groupName
		});
		console.log("groupName=" + groupName + " index="+ index);
       // return this.groups.indexOf({GroupName: groupName});
	   return index;
    }	
	
    saveGroup() {
		this.statusMessage = [];
		this.userToGroupService.addNewGroupForUser(this.selectedUserName, this.selectedGroupNames)
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
	}	
	
	refreshTable() {
		this.dt.reset(); 
	}
  
	openWiki() {
		window.open(this.wikiLink,'wiki');
  }
}
