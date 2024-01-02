import { Component,ViewChild, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table'; 
import { Config } from '../configs/config';
import { ConfigService } from '../configs/configservice';
import { Globals } from '../conf/globals'
import { Pg } from './pg';
import { PgService } from './pgservice';
import { Pe } from '../pe/pe';
import { LoadingDisplayService } from '../common/components/loading-display/loading-display.service';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { PgMemberList } from './pgmemberlist';

@Component({
  selector: 'pg',
  templateUrl: './pg.component.html',
  styleUrls: ['./pg.component.scss'],
  providers:  [Globals,DialogService, DynamicDialogRef, DynamicDialogConfig] 
})


	 
export class PgComponent implements OnInit {
	@ViewChild(Table) 
	private dt:Table;
	displayDialog: boolean;
	displayAssignDialog: boolean;
	displayDeassignDialog: boolean;
    pg: Pg = new PrimePg();
    selectedPg: Pg;
    newPg: boolean;
    pgs: Pg[];
	postData: string;
	selectedPes: string[] = [];
	availablePes: SelectItem[] =[];
	includedPes: SelectItem[] = [];
	errorMessage: string;
	wikiLink: string;
	statusMessage: Message[] = [];	
	loadingComplete: boolean = false;	
	
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private appservice: ConfigService, private pgService: PgService, private globals: Globals,private loadingDisplayService: LoadingDisplayService, public dialogService: DialogService) { 
   	if (this.globals.wikiBaseUrl === "") {
		this.appservice.getWikiUrlParam().then(data => {this.globals.wikiBaseUrl = data; 
		this.wikiLink = this.globals.wikiBaseUrl + this.globals.managePGWiki},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
	}
	else this.wikiLink = this.globals.wikiBaseUrl + this.globals.managePGWiki; 
  }

  ngOnInit() {
	this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Loading protection group info...'});
    this.pgService.getPgs().subscribe((pgs:Pg[]) => {this.pgs = pgs; this.statusMessage = [];this.loadingComplete = true;this.loadingDisplayService.setLoading( false );},
		error =>  {this.handleError(error);this.errorMessage = <any>error;this.loadingComplete = true;this.loadingDisplayService.setLoading( false );});	  
  }

    showDialogToAdd() {
        this.newPg = true;
        this.pg = new PrimePg();
        this.displayDialog = true;
		this.displayDeassignDialog = false;
        this.displayAssignDialog = false;
    }
	
    showDialogToAssign(pg) {
        this.newPg = false;
        this.pg = this.clonePg(pg);
		this.selectedPg = pg;
		this.selectedPes = [];
		this.availablePes = [];
		this.pgService.getAvailablePes(pg.dataGroup).subscribe((availablePes:SelectItem[]) =>{
		this.availablePes = availablePes;
		this.displayDeassignDialog = false;
        this.displayAssignDialog = true;} , 
		error => {this.handleError(error);this.errorMessage = <any>error});
		
    }

	showDialogToRemove(pg){
        this.newPg = false;
        this.pg = this.clonePg(pg);
		this.selectedPg = pg;
		this.includedPes = [];
		this.selectedPes = [];
		this.pgService.getIncludedPes(pg.dataGroup).subscribe((includedPes:SelectItem[]) => this.includedPes = includedPes, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});
		this.displayAssignDialog = false;
		this.displayDeassignDialog = true;	
	}

	showMemberDialog(pg){
		//console.log("passed in pg name="+pg.dataGroup);
	   const ref = this.dialogService.open(PgMemberList, {
			data: {
				id: pg.dataGroup
			},
			header: 'Users in Protection Group: '+ pg.dataGroup,
			width: '70%'
		});
	}

    save() {
		this.clearMsg();
        if(this.newPg) {
			if (this.pg.dataGroup) {
				if (this.pgExists(this.pg.dataGroup, this.pgs)) {
					alert("The Protection Group name " + this.pg.dataGroup + " is taken.  Please try a different name.");
				}
				this.pgService.addNewPg(this.pg)
				.subscribe(
					data => this.postData = JSON.stringify(data),
					error => {this.handleError(error);this.errorMessage = <any>error},
					() => {this.statusMessage.push({severity:'success', summary: 'Success', detail:'New protection group is saved. Do not forget to add some protection element(s).'});this.refreshTable(); }
				);
				this.pgs.push(this.pg);
			}
		}
        else {
			this.pgService.modifyExistingPg(this.pg)
			.subscribe(
				data => this.postData = JSON.stringify(data),
				error => {this.handleError(error);this.errorMessage = <any>error},
				() => {this.statusMessage.push({severity:'success', summary: 'Success', detail:'Protection group is updated'});this.refreshTable(); }
			);
            this.pgs[this.findSelectedPgIndex()] = this.pg;
		}
        this.pg = null;
        this.displayDialog = false;
    }
	
	addPEs(){
        if (this.selectedPes.length >= 1)
		{	
			this.clearMsg();
			this.pgService.addPEsToExistingPg(this.pg, this.selectedPes.join(","))
			.subscribe(
				data => this.postData = JSON.stringify(data),
				error =>  {this.handleError(error);this.errorMessage = <any>error; this.refreshTable()},
				() => {this.statusMessage.push({severity:'success', summary: 'Success', detail:'Added new protection element(s).'});this.refreshTable(); }
			);
			
			let tmpString = this.makePEsFromSelectItem(this.selectedPes);
			if (this.pgs[this.findSelectedPgIndex()].dataSets){
				//this.pgs[this.findSelectedPgIndex()].dataSets += ", NCIA."+this.selectedPes.join(", NCIA.");
				//this.pgs[this.findSelectedPgIndex()].dataSets += ", NCIA."+ makePEsFromSelectItem(this.selectedPes).join(", NCIA.");
				this.pgs[this.findSelectedPgIndex()].dataSets += ", NCIA."+ tmpString.join(", NCIA.");
			}
			else {
				//this.pgs[this.findSelectedPgIndex()].dataSets += "NCIA." + this.selectedPes.join(", NCIA.");
				//this.pgs[this.findSelectedPgIndex()].dataSets = "NCIA."+ makePEsFromSelectItem(this.selectedPes).join(", NCIA.");
				this.pgs[this.findSelectedPgIndex()].dataSets = "NCIA."+ tmpString.join(", NCIA.");				
			}
		}
        this.pg = null;
        this.displayAssignDialog = false;
    }
	
	removePEs(){
		this.clearMsg();
        if (this.selectedPes.length >= 1)
		{
			this.pgService.removePEsFromPg(this.pg, this.selectedPes.join(","))
			.subscribe(
				data => this.postData = JSON.stringify(data),
				error => {this.handleError(error);this.errorMessage = <any>error;this.refreshTable()},
				() => {this.statusMessage.push({severity:'success', summary: 'Success', detail:'Removed some protection elements from a group'});this.refreshTable(); }
			);
			
			//diffArray(this.includedPes, this.selectedPes)
			var item = this.includedPes;
			var includedPENames = this.includedPes.map(function(item){ return item.label;});
			this.pgs[this.findSelectedPgIndex()].dataSets = this.diffArray(includedPENames, this.selectedPes).join(", ");
		}

        this.pg = null;
        this.displayDeassignDialog = false;
    }	

    delete() {
		console.log('delete PG');
		this.clearMsg();
		this.pgService.deleteSelectPg(this.pg)
			.subscribe(
				data => this.postData = JSON.stringify(data),
				error => {this.handleError(error);this.errorMessage = <any>error; this.refreshTable();},
				() => {this.statusMessage.push({severity:'success', summary: 'Success', detail:'Protection group is deleted.'}); this.refreshTable();}
			);
        this.pgs.splice(this.findSelectedPgIndex(), 1);
        this.pg = null;
        this.displayDialog = false;
    }
	
    onSelect(pg) {
        this.newPg = false;
        this.pg = this.clonePg(pg);
		this.selectedPg = pg;
        this.displayDialog = true;
    }
	
	/*
	
    onRowSelect(event) {
        this.newPg = false;
        this.pg = this.clonePg(event.data);
        this.displayDialog = true;
    }
*/
    onRowSelect(event) {
		this.selectedPg = event.data;
        //this.messageService.add({severity:'info', summary:'Car Selected', detail:'Vin: ' + event.data.vin});
    }

    onRowUnselect(event) {
        //this.messageService.add({severity:'info', summary:'Car Unselected', detail:'Vin: ' + event.data.vin});
    }
    clonePg(u: Pg): Pg {
        let pg = new PrimePg();
        for(let prop in u) {
            pg[prop] = u[prop];
        }
        return pg;
    }

    findSelectedPgIndex(): number {
        return this.pgs.indexOf(this.selectedPg);
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
	
	makePEsFromSelectItem(a: string[]): Pe[] {
	  var pes = [];
	  for ( var i = 0; i < a.length; i++) {
		  pes.push(a[i].split('//',1)[0]);
		  pes.push(a[i]);
	  }
	  return pes;
	}

	removeItem(array, item){
		for(var i in array){
			if(array[i]==item){
				array.splice(i,1);
				break;
            }
		}
    }
	
	pgExists(nameKey, myArray): boolean{
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

class PrimePg implements Pg {
	dataGroup: string;
	description: string;
	dataSets: string ;
 //   constructor(public dataGroup?, public description?, public dataSets?) {}
}


