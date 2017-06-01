import {Component} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Dropdown,InputText,MultiSelect,Messages,DataTable,Button,Dialog,Column,Header,Footer} from 'primeng/primeng';
import {Checkbox} from 'primeng/primeng';
import {SelectItem,Message} from 'primeng/primeng';
import {Group} from './groups/group';
import {PgRole} from './pgRoles/pgRole';
import {GroupService} from './groups/groupservice';
import myGlobals = require('./conf/globals');


@Component({
	templateUrl: 'app/group.component.html',
	selector: 'group',
    directives: [Dropdown,InputText,MultiSelect,Messages,Checkbox,DataTable,Button,Dialog,Column,Header,Footer],
	providers: [HTTP_PROVIDERS,GroupService]
})

export class GroupComponent{
	displayDialog: boolean;
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
	
    constructor(private groupService: GroupService) {
		this.wikiLink = myGlobals.wikiContextSensitiveHelpUrl + myGlobals.manageGroupWiki;
	}

    ngOnInit() {
		this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Loading group data...'});
        this.groupService.getGroups().then(groups => {this.groups = groups; this.statusMessage = [];},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
		this.selectedGroupName = null;
		
		this.availablePgs = [];
		this.availablePgs.push({label:'Choose', value:''});	
		
		this.allRoles = [];	
    }

    showDialogToAdd() {
        this.group = new PrimeGroup();
        this.displayDialog = true;
		this.displayDeassignDialog = false;
        this.displayAssignDialog = false;
    }
	
    showDialogToAssign(group) {
		this.displayDialog = false;
		this.displayDeassignDialog = false;
		this.selectedPGName = null;	
        this.group = this.cloneGroup(group);
		this.selectedGroup = group;

		this.groupService.getAvailablePgs(group.userGroup).then(availablePgs =>{
		this.availablePgs = availablePgs;
		// a workaround to show the choose as the initial tool tip as the dropdown box dose not provide it
		//this.availablePgs.unshift({label:'Choose', value:''});
		}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});		
		
		this.srs = [];
		this.groupService.getAllRoles().then(allRoles => {
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
		this.groupService.getAllRoles().then(allRoles => {
		this.allRoles = allRoles;
		this.srs = pg.roleNames.split(", ");		
		this.displayDeassignDialog = true;
		}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});			
	}	

    save() {
		this.statusMessage = [];
  
		this.groupService.addNewPgRoleForGroup(this.selectedGroup.userGroup, this.selectedPGName, this.srs.join(","))
		.subscribe(
			data => this.postData = JSON.stringify(data),
			error =>  {this.handleError(error);this.errorMessage = <any>error},
			() => console.log("Finished")
		);

		this.group.pgs.push(new PrimePgRole(this.selectedPGName, this.srs.join(", ")));
		this.displayAssignDialog = false;
    }
	
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
		this.groupService.deleteSelectGroup(this.group)
			.subscribe(
				data => this.postData = JSON.stringify(data),
				error => {this.handleError(error);this.errorMessage = <any>error},
				() => console.log("Finished")
			);
        this.groups.splice(this.findSelectedGroupIndex(), 1);
        //this.group = null;
        this.displayDialog = false;
    }
	
    onSelect(group) {
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
			if (myArray[i].dataGroup.toUpperCase() == nameKey.toUpperCase()) {
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
}

class PrimeGroup implements Group {
    constructor(public userGroup?, public description?, public pgs?) {}
}

class PrimePgRole implements PgRole {
    constructor(public pgName?, public roleNames?) {}
}