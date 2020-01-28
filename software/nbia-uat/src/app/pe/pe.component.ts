import { Component, ViewChild, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
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
}

class PrimePe implements Pe {
	collection: string;
	site: string
 //   constructor(public collection?, public site?) {}
}