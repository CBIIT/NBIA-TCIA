import { Component, ViewChild, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table'; 
import { Config } from '../configs/config';
import { ConfigService } from '../configs/configservice';
import { Globals } from '../conf/globals'
import { Pe } from './pe';
import { PeService } from './peservice';
import { LoadingDisplayService } from '../common/components/loading-display/loading-display.service';

@Component({
  selector: 'pe',
  templateUrl: './pe.component.html',
  styleUrls: ['./pe.component.scss'],
  providers:  [Globals]  
})
export class PeComponent implements OnInit {
	@ViewChild(Table, {static: false}) 
	private dt:Table;	
	displayDialog: boolean;
    pe: Pe = new PrimePe();
    selectedPe: Pe;
    newPe: boolean;
    pes: Pe[];
	postData: string;
	wikiLink: string;
	statusMessage: Message[] = [];
	errorMessage: string;
	loadingComplete: boolean = false;
	displayAssignDialog: boolean = false;
	displayDeassignDialog: boolean = false;
	availablePgs: SelectItem[] =[];
	selectedPgs: string[] = [];
	includedPgs: SelectItem[] = [];
	combSym: string = "//";
	appName: string = "NCIA.";
	comma: string = ", ";
	

  constructor(private appservice: ConfigService, private peService: PeService, private globals: Globals, private loadingDisplayService: LoadingDisplayService) { 
  	if (this.globals.wikiBaseUrl === "") {
		this.appservice.getWikiUrlParam().then(data => {this.globals.wikiBaseUrl = data; 
		this.wikiLink = this.globals.wikiBaseUrl + this.globals.managePEWiki},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
	}
	else this.wikiLink = this.globals.wikiBaseUrl + this.globals.managePEWiki;
  }

  ngOnInit() {
	this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Loading collection and site list...'});
	this.peService.getPes().subscribe((pes:Pe[]) => {this.pes = pes; this.statusMessage = [];this.loadingComplete = true;this.loadingDisplayService.setLoading( false );}, 
	error =>  {this.handleError(error);this.errorMessage = <any>error;this.loadingComplete = true;this.loadingDisplayService.setLoading( false );});	  
  }
  
    showDialogToAdd() {		
        this.newPe = true;
        this.pe = new PrimePe();

		this.displayDialog = true;
    }

    save() {
        if(this.pe.collection && this.pe.site) {
			if (this.peExists(this.pe.collection, this.pe.site, this.pes)) {
				this.clearMsg();
				let msg = "The collection name " + this.pe.collection + " and site name " + this.pe.site + " are taken.  Please use different names.";
				this.statusMessage.push({severity:'error', summary: 'Error', detail: msg});
				alert("The collection name " + this.pe.collection + " and site " + this.pe.site + " are taken.  Please use different names.");
			}
			else {
				this.clearMsg();
				this.peService.addNewPe(this.pe)
				.subscribe(
					data => this.postData = JSON.stringify(data),
					error => this.handleError(error),
				    () =>{this.statusMessage.push({severity:'success', summary: 'Success', detail:'New collection/site is saved.'});this.refreshTable()}
//					() => console.log("Finished")
				);
				this.pe.dataSets="";
				this.pes.push(this.pe);
				this.displayDialog = false;
			}
		}
		else {
			this.clearMsg();
			this.statusMessage.push({severity:'error', summary: 'Error', detail:'Please fill the required collection and site field.'});
		}		
    }

	showDialog(u) {
        this.newPe = false;
        this.pe = this.clonePe(u);
		this.selectedPe=u;
        this.displayDialog = true;
    }

    clonePe(u: Pe): Pe {
        let pe = new PrimePe();
        for(let prop in u) {
            pe[prop] = u[prop];
        }
        return pe;
    }

//    findSelectedPeIndex(): number {
//       return this.pes.indexOf(this.selectedPe);
//    }
	
	peExists(nameKey1, nameKey2, myArray): boolean{
		for (var i=0; i < myArray.length; i++) {
			if (myArray[i].collection.toUpperCase() == nameKey1.toUpperCase()&& myArray[i].site.toUpperCase() == nameKey2.toUpperCase()) {
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

    showDialogToAssign(pe) {
		this.displayDialog = false;
        this.newPe = false;
        this.pe = this.clonePe(pe);
		this.selectedPe = pe;
		this.selectedPgs = [];
		this.availablePgs = [];
		this.peService.getAvailablePgs('NCIA.'+pe.collection +'//'+ pe.site).subscribe((availablePgs:SelectItem[]) =>{
		this.availablePgs = availablePgs;
		this.displayDeassignDialog = false;
        this.displayAssignDialog = true;} , 
		error => {this.handleError(error);this.errorMessage = <any>error});
		//this.displayDeassignDialog = false;
		//this.displayAssignDialog = true;
    }

	showDialogToRemove(pe){
        this.newPe = false;
        this.pe = this.clonePe(pe);
		this.selectedPe = pe;
		this.includedPgs = [];
		this.selectedPgs = [];
		this.peService.getAssociatedPgs(pe).subscribe((includedPgs:SelectItem[]) => this.includedPgs = includedPgs, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});
		this.displayAssignDialog = false;
		this.displayDeassignDialog = true;	
	} 

	addPgs(){
        if (this.selectedPgs.length >= 1)
		{	
			this.clearMsg();
			this.peService.addPesToPgs(this.pe, this.selectedPgs.join(","))
			.subscribe(
				data => this.postData = JSON.stringify(data),
				error =>  {this.handleError(error);this.errorMessage = <any>error; this.refreshTable()},
				() => {this.statusMessage.push({severity:'success', summary: 'Success', detail:'Assigned to new protection group(s).'});this.refreshTable(); }
			);
			
			let tmpString = this.makePGsFromSelectItem(this.selectedPgs);
			if (this.pes[this.findSelectedPeIndex()].dataSets){
				//this.pgs[this.findSelectedPgIndex()].dataSets += ", NCIA."+this.selectedPes.join(", NCIA.");
				//this.pgs[this.findSelectedPgIndex()].dataSets += ", NCIA."+ makePEsFromSelectItem(this.selectedPes).join(", NCIA.");
				//this.pes[this.findSelectedPeIndex()].dataSets += ", NCIA."+ tmpString.join(", NCIA.");
				this.pes[this.findSelectedPeIndex()].dataSets += ", "+ tmpString.join(", ");
			}
			else {
				//this.pgs[this.findSelectedPgIndex()].dataSets += "NCIA." + this.selectedPes.join(", NCIA.");
				//this.pgs[this.findSelectedPgIndex()].dataSets = "NCIA."+ makePEsFromSelectItem(this.selectedPes).join(", NCIA.");
				//this.pes[this.findSelectedPeIndex()].dataSets = "NCIA."+ tmpString.join(", NCIA.");	
				this.pes[this.findSelectedPeIndex()].dataSets = tmpString.join(", ");
			}
		}
        //this.pe = null;
        this.displayAssignDialog = false;
    }
	
    findSelectedPeIndex(): number {
        return this.pes.indexOf(this.selectedPe);
    }
	
	makePGsFromSelectItem(a: string[]): Pg[] {
	  var pgs = [];
	  for ( var i = 0; i < a.length; i++) {
		  //pgs.push(a[i].split('//',1)[0]);
		  pgs.push(a[i]);
	  }
	  return pgs;
	}

	removePGs(){
		this.clearMsg();
        if (this.selectedPgs.length >= 1)
		{
			this.peService.removePGsFromPe(this.pe, this.selectedPgs.join(","))
			.subscribe(
				data => this.postData = JSON.stringify(data),
				error => {this.handleError(error);this.errorMessage = <any>error;this.refreshTable()},
				() => {this.statusMessage.push({severity:'success', summary: 'Success', detail:'Removed some protection elements from a group'});this.refreshTable(); }
			);
			
			//diffArray(this.includedPes, this.selectedPes)
			var item = this.includedPgs;
			var includedPGNames = this.includedPgs.map(function(item){ return item.label;});
			this.pes[this.findSelectedPeIndex()].dataSets = this.diffArray(includedPGNames, this.selectedPgs).join(", ");
		}

        //this.pe = null;
        this.displayDeassignDialog = false;
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
		
}

class PrimePe implements Pe {
	collection: string;
	site: string;
	dataSets: string;
 //   constructor(public collection?, public site?) {}
}