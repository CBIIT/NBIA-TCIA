import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Table } from 'primeng/table';
import { SelectItem } from 'primeng/api';
import { Config } from '../configs/config';
import { ConfigService } from '../configs/configservice';
import { Globals } from '../conf/globals'
import { Group } from './group';
import { PgRole } from '../pgRole/pgRole';
import { GroupService } from './groupservice';
import { LoadingDisplayService } from '../common/components/loading-display/loading-display.service';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { DialogService } from 'primeng/components/dynamicdialog/dialogservice';
import { UgMemberList } from './ugmemberlist';

@Component({
  selector: 'group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  providers:  [Globals, DialogService, DynamicDialogRef, DynamicDialogConfig]    
})
export class GroupComponent implements OnInit {
	@ViewChild(Table, {static: false}) 
//	@Input() selectedTabHeader: string;
	private dt:Table;
	displayDialog: boolean;
	displayAddDialog: boolean;
	displayAssignDialog: boolean;
	displayDeassignDialog: boolean;
    group: Group = new PrimeGroup();
    selectedGroup: Group;
    groups: Group[];
	postData: string;
	selectedPgs: string[] = [];
	availablePgs: SelectItem[] =[];
	includedPgs: SelectItem[] = [];
	allRoles: SelectItem[] =[];
	errorMessage: string;
	selectedPGName: string;
	wikiLink: string;
	statusMessage: Message[] = [];	
	selectedGroupName: string;
	srs: string[] = [];	
	loadingComplete: boolean = false;
	newGroup: boolean;
	
	
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private appservice: ConfigService, private groupService: GroupService, private globals: Globals, private loadingDisplayService: LoadingDisplayService, public dialogService: DialogService) { 
  	if (this.globals.wikiBaseUrl === "") {
		this.appservice.getWikiUrlParam().then(data => {this.globals.wikiBaseUrl = data; 
		this.wikiLink = this.globals.wikiBaseUrl + this.globals.manageGroupWiki},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
	}
	else this.wikiLink = this.globals.wikiBaseUrl + this.globals.manageGroupWiki;  
  }

  ngOnInit() {
	this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Loading user group info...'});
//	console.log("selected tab index="+ this.selectedTabHeader);
//    if (this.selectedTabHeader == "User Group") {
//		this.loadingDisplayService.setLoading( true, 'Loading user group data...' );
//		this.groupService.getGroups().subscribe((groups:Group[]) => {this.groups = groups; this.statusMessage = [];this.loadingDisplayService.setLoading( false );},
//			error =>  {this.handleError(error);this.errorMessage = <any>error,this.loadingDisplayService.setLoading( false );});
//	}
//	else {
		this.groupService.getGroups().subscribe((groups:Group[]) => {this.groups = groups; this.statusMessage = []; this.loadingComplete = true;this.loadingDisplayService.setLoading( false );},
		error =>  {this.handleError(error);this.errorMessage = <any>error;this.loadingComplete = true;this.loadingDisplayService.setLoading( false );});
//	}
		this.selectedGroupName = null;
		
		this.availablePgs = [];
		this.availablePgs.push({label:'Choose', value:''});	
		this.appservice.getWikiUrlParam().then(data => {this.wikiLink = data + this.globals.manageGroupWiki},
		error =>  {this.handleError(error);this.errorMessage = <any>error});		
		this.allRoles = [];		  
  }

    showDialogToAdd() {
        this.group = new PrimeGroup();
		this.newGroup = true;
        this.displayAddDialog = true;
		this.displayDeassignDialog = false;
        this.displayAssignDialog = false;
    }
	
    showDialogToAssign(group) {
		this.displayDialog = false;
		this.displayDeassignDialog = false;
		this.selectedPGName = null;	
        this.group = this.cloneGroup(group);
		this.selectedGroup = group;

		this.groupService.getAvailablePgs(group.userGroup).subscribe((availablePgs:SelectItem[]) =>{
		this.availablePgs = availablePgs;
		// a workaround to show the choose as the initial tool tip as the dropdown box dose not provide it
		//this.availablePgs.unshift({label:'Choose', value:''});
		}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});		
		
		this.srs = [];
		this.groupService.getAllRoles().subscribe((allRoles:SelectItem[]) => {
		this.allRoles = allRoles;		
		this.displayAssignDialog = true;
		}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});			
	}
	
    showDialogToEdit(group, pg) {
		this.displayDialog = false;
		this.displayAssignDialog = false;
		this.selectedPGName = pg.pgName;
        this.group = this.cloneGroup(group);
		this.selectedGroup = group;
		this.groupService.getAllRoles().subscribe((allRoles:SelectItem[])=> {
		this.allRoles = allRoles;
		this.srs = pg.roleNames.split(", ");		
		this.displayDeassignDialog = true;
		}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});			
	}

	showMemberDialog(group){
		//console.log("passed in pg name="+pg.dataGroup);
	   const ref = this.dialogService.open(UgMemberList, {
			data: {
				id: group.userGroup
			},
			header: 'Users in User Group: '+ group.userGroup,
			width: '70%'
		});
	}	

    save() {
		this.statusMessage = [];
  
		this.groupService.addNewPgRoleForGroup(this.selectedGroup.userGroup, this.selectedPGName, this.srs.join(","))
		.subscribe(
			data => this.postData = JSON.stringify(data),
			error =>  {this.handleError(error);this.errorMessage = <any>error},
			() => console.log("Finished")
		);
		let aPgRole = new PrimePgRole();
			aPgRole.pgName = this.selectedPGName;
			aPgRole.roleNames = this.srs.join(", ");
		this.group.pgs.push(aPgRole);
		this.displayAssignDialog = false;
    }
	
	saveGroup() {
		this.clearMsg();
        if(this.newGroup) {
			if (this.group.userGroup) {
				if (this.groupExists(this.group.userGroup, this.groups)) {
					alert("The User Group name " + this.group.userGroup + " is taken.  Please try a different name.");
				}
				else {
					this.groupService.addNewGroup(this.group)
					.subscribe(
						data => this.postData = JSON.stringify(data),
						error => {this.handleError(error);this.errorMessage = <any>error},
						() => {this.displayAddDialog = false; this.newGroup = false; this.statusMessage.push({severity:'success', summary: 'Success', detail:'New user group is saved. Do not forget to add some protection group(s).'});this.refreshTable(); }
					);
					this.groups.push(this.group);
				}
			}
		}
       else {
			this.groupService.modifyExistingGroup(this.group)
			.subscribe(
				data => this.postData = JSON.stringify(data),
				error => {this.handleError(error);this.errorMessage = <any>error},
				() => {this.displayDialog=false; this.statusMessage.push({severity:'success', summary: 'Success', detail:'User group is updated'});this.refreshTable(); }
			);
            this.groups[this.findSelectedGroupIndex()] = this.group;
		}
		
 //       this.group = null;
        this.displayAddDialog = false;
    }
/*	
	modifyExistingGroup(group: Group) {
		var serviceUrl = this.globals.serviceUrl +'modifyUserGroup';
		var params = '?PGName=' + pg.dataGroup + '&description='+pg.description;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());
	}	
	
*/	
	
    deassignPG() {
		this.statusMessage = [];
  
		this.groupService.removeGroupFromPG(this.selectedGroup.userGroup, this.selectedPGName)
		.subscribe(
			data => this.postData = JSON.stringify(data),
			error =>  {this.handleError(error);this.errorMessage = <any>error},
			() => console.log("Finished")
		);
		
        this.group.pgs.splice(this.findSelectedPgRoleIndex(), 1);	
		this.displayDeassignDialog = false;	
	}	
	
    findSelectedPgRoleIndex(): number {
 //ES6 freaure       return this.group.pgs.findIndex(x =>x.pgName === this.selectedPGName);
	for ( var i = 0; i < this.group.pgs.length; i++) {
		  if (this.group.pgs[i].pgName == this.selectedPGName)
			return i;
	}
    }

	updateRole(){
		this.statusMessage = [];
  
		this.groupService.modifyRolesOfGroupForPG(this.selectedGroup.userGroup, this.selectedPGName, this.srs)
		.subscribe(
			data => this.postData = JSON.stringify(data),
			error =>  {this.handleError(error);this.errorMessage = <any>error},
			() => console.log("Finished")
		);
		
        this.group.pgs[this.findSelectedPgRoleIndex()].roleNames = this.srs.join(", ");	

		this.displayDeassignDialog = false;		
	}		

    delete() {
		this.clearMsg();
		if (confirm("Do you want to delete the user group?") == true) {
			this.groupService.deleteSelectGroup(this.group)
				.subscribe(
					data => this.postData = JSON.stringify(data),
					error => {this.handleError(error);this.errorMessage = <any>error;this.refreshTable()},
					() => {console.log("Finished"); this.refreshTable()}
				);
			this.groups.splice(this.findSelectedGroupIndex(), 1);
			//this.group = null;
			this.displayDialog = false;
		}
    }
	
    onSelect(group) {
		console.log("click user group-- edit or delete user group");
		this.newGroup = false;
        this.group = this.cloneGroup(group);
		this.selectedGroup = group;
        this.displayDialog = true;
    }
	
    onRowSelect(event) {
        this.group = this.cloneGroup(event.data);
        this.displayDialog = true;
    }

    cloneGroup(u: Group): Group {
        let group = new PrimeGroup();
        for(let prop in u) {
            group[prop] = u[prop];
        }
        return group;
    }

    findSelectedGroupIndex(): number {
        return this.groups.indexOf(this.selectedGroup);
    }
	
	diffArray(a, b): any[] {
	  var seen = [], diff = [];
	  for ( var i = 0; i < b.length; i++)
		  seen[b[i]] = true;
	  for ( var i = 0; i < a.length; i++)
		  if (!seen[a[i]])
			  diff.push(a[i]);
	  return diff;
	}

	removeItem(array, item){
		for(var i in array){
			if(array[i]==item){
				array.splice(i,1);
				break;
            }
		}
    }
	
	groupExists(nameKey, myArray): boolean{
		for (var i=0; i < myArray.length; i++) {
			if (myArray[i].userGroup.toUpperCase() == nameKey.toUpperCase()) {
				return true;
			}
		}
		return false;
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
		else if (error.status === undefined){
			this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Sent.'});
		}
		else {
			this.statusMessage.push({severity:'error', summary:'Error: ', detail:'Error occured while retriving data from server. Check the server connection please. Error code: '+error.status});
		}
	}

	private clearMsg() {
		this.statusMessage = [];
	}
	
	refreshTable() {
		this.dt.reset(); 
	}

	openWiki() {
	window.open(this.wikiLink,'wiki');
  }	
}

class PrimeGroup implements Group {
	userGroup: string;
	description: string;
	pgs: PgRole[];
    //constructor(public userGroup?, public description?, public pgs?) {}
}

class PrimePgRole implements PgRole {
	pgName: string;
	roleNames: string;
 //   constructor(public pgName?, public roleNames?) {}
}