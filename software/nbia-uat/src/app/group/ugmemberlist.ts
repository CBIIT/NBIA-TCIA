import { Component } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import {DynamicDialogRef} from 'primeng/api';
import {DynamicDialogConfig} from 'primeng/api';

import {UgMemberService} from './ugmemberservice';

@Component({
    template: `
		<p-table  [value]="users" [paginator]="true" [rows]="10" [responsive]="true"
		[showCurrentPageReport] = "true" currentPageReportTemplate="{totalPages} pages&nbsp;&nbsp;"	[rowsPerPageOptions]="[10,20,50,100,{showAll:'All'}]" [responsive]="true" [styleClass]="'base-table'">
	
        <!--p-table [value]="users" [paginator]="true" [rows]="5" [responsive]="true"-->
            <ng-template pTemplate="header">
                <tr>
                    <th pSortableColumn="UserName">Login Name<p-sortIcon field="UserName"></p-sortIcon></th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-user>
                <tr>
                    <td><span class="ui-column-title">UserName</span>{{user.UserName}}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
export class UgMemberList {
	users: string[];
	statusMessage: Message[] = [];	
            
    constructor(private ugmemberService: UgMemberService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

    ngOnInit() {
//		console.log("pg name=" + this.config.data.id);
		this.ugmemberService.getUgUsers(this.config.data.id).subscribe((users:string[]) =>{
		this.users = users;} , 
		error => {
			//this.handleError(error);this.errorMessage = <any>error
			});
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