import { Component, Output, EventEmitter, ViewChild, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { UserService } from './userservice';
import { Globals } from '../conf/globals'
import { Config } from '../configs/config';
import { ConfigService } from '../configs/configservice';
import { Message } from 'primeng/components/common/api';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table'; 
import { MessageService } from 'primeng/api';
import { LoadingDisplayService } from '../common/components/loading-display/loading-display.service';
//import { Table } from 'primeng/table';


@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers:  [ MessageService]
})
export class UserComponent implements OnInit {
	@ViewChild(Table, {static: false}) 
	private dt:Table;
	@Output() addUser: EventEmitter<any> = new EventEmitter();
	displayDialog: boolean;
    user: User = new PrimeUser();
    selectedUser: User;
    newUser: boolean;
    users: User[] = [];
	postData: string;
	wikiLink: string;
	statusMessage: Message[] = [];
	errorMessage: string;
	
	activeStatus: SelectItem[];
	clonedUsers: { [s: string]: User; } = {};

  constructor(private appservice: ConfigService, private userService: UserService, private globals: Globals, private messageService: MessageService, private loadingDisplayService: LoadingDisplayService) { 
	this.activeStatus = [
      {label:'true', value:1},
      {label:'false', value:0},
    ];
	
	if (this.globals.wikiBaseUrl === "") {
		this.appservice.getWikiUrlParam().then(data => {this.globals.wikiBaseUrl = data; 
		this.wikiLink = this.globals.wikiBaseUrl + this.globals.manageUserWiki},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
	}
	else this.wikiLink = this.globals.wikiBaseUrl + this.globals.manageUserWiki;
  }

  ngOnInit() {
	this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Loading user data...'});
	this.loadingDisplayService.setLoading( true, 'Loading user data...' );
	this.userService.getUsers().subscribe((users:User[]) => {this.users = users; this.statusMessage = [];this.loadingDisplayService.setLoading( false );}, 
	error =>  {this.handleError(error);this.errorMessage = <any>error; this.loadingDisplayService.setLoading( false );});
  }
  
  onRowEditInit(user: User) {
        this.clonedUsers[user.loginName] = {...user};
    }

  onRowEditSave(user: User) {
	  console.log("onEditSave: loginName=" + user.loginName +" email=" + user.email + " active=" + user.active);
		var idx = this.users.findIndex(a => a.loginName === user.loginName);
		this.users[idx] = user;
        if (user.loginName && user.email) {
			delete this.clonedUsers[user.loginName];
			this.clearMsg();
			this.userService.modifyExistingUser(user)
			.subscribe(
				data => this.postData = JSON.stringify(data),
				error => this.handleError(error),
//				() => console.log("Finished")
				() => this.messageService.add({severity:'success', summary: 'Success', detail:'User ' + user.loginName +' is updated.'})
			);
            
            //this.messageService.add({severity:'success', summary: 'Success', detail:'User is updated'});
        }
       else 
	   {
            //this.messageService.add({severity:'error', summary: 'Error', detail:'Login name is required.'});
			this.statusMessage.push({severity:'error', summary: 'Error', detail:'Please fill the required field.'});
        }
    }

    onRowEditCancel(user: User, index: number) {
		console.log("onEditCancel: index=" + index);
		console.log("onEditCancel: loginName=" + user.loginName +" email=" + user.email + " active=" + user.active);
		console.log("onEditCancelCloned: loginName=" + this.clonedUsers[user.loginName].loginName +" email=" + this.clonedUsers[user.loginName].email + " active=" + this.clonedUsers[user.loginName].active);
//        this.dt22 = '';
//		this.dt23 = '';

//		this.users[index] = this.clonedUsers[user.loginName];
        var idx = this.users.findIndex(a => a.loginName === user.loginName);
		console.log("onEditCancel: idx=" + idx);
		this.users[idx] = this.clonedUsers[user.loginName];
        delete this.clonedUsers[user.loginName];
    }
 

    showDialogToAdd() {
        this.newUser = true;
        this.user = new PrimeUser();
        this.displayDialog = true;
    }
	
    saveNew() {
	  console.log("saveNew: loginName=" + this.user.loginName +" email=" + this.user.email + " active=" + this.user.active);		
		if (this.user.loginName && this.user.email && (this.user.active !== undefined)) {  
			if (this.userExists(this.user.loginName, this.users)) {
				this.clearMsg();
				this.statusMessage.push({severity:'error', summary: 'Error', detail:'The login name ' + this.user.loginName + ' is taken.  Please try a different name.'});
//				alert("The login name " + this.user.loginName + " is taken.  Please try a different name.");
			}
			else {
				this.clearMsg();
				this.userService.addNewUser(this.user)
				.subscribe(
					data => this.postData = JSON.stringify(data),
					error => this.handleError(error),
//					() => console.log("Finished")
					() => {this.messageService.add({severity:'success', summary: 'Success', detail:'User is saved.'});this.refreshTable(); }
				);
				this.users.push(this.user);
				this.addUser.next (this.user.loginName);
				this.user = null;
				this.displayDialog = false;
			}
		}
		else {
			this.clearMsg();
			this.statusMessage.push({severity:'error', summary: 'Error', detail:'Please fill the required field.'});
			return;
		}		
    }
	
	showDialog(u) {
        this.newUser = false;
        this.user = this.cloneUser(u);
		this.selectedUser=u;
        this.displayDialog = true;
    }

    cloneUser(u: User): User {
        let user = new PrimeUser();
        for(let prop in u) {
            user[prop] = u[prop];
        }
        return user;
    }

    findSelectedUserIndex(): number {
        return this.users.indexOf(this.selectedUser);
    }
	
	userExists(nameKey, myArray): boolean{
		for (var i=0; i < myArray.length; i++) {
			if (myArray[i].loginName.toUpperCase() == nameKey.toUpperCase()) {
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

class PrimeUser implements User {
//    constructor(public loginName:string, public email: string, public active: string) {}
	loginName: string;
	email: string;
	active: string;
}