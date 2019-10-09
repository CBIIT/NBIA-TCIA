import {Component,Output,EventEmitter} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {InputText,DataTable,Messages,Button,Dialog,Column,Header,Footer} from 'primeng/primeng';
import {Checkbox,Message} from 'primeng/primeng';
import {Pe} from './pes/pe';
import {PeService} from './pes/peservice';
import myGlobals = require('./conf/globals');
import {ConfigService,Config} from './configs/configservice';

@Component({
	templateUrl: 'app/pe.component.html',
	selector: 'pe',
    directives: [InputText,Checkbox,DataTable,Messages,Button,Dialog,Column,Header,Footer],
	providers: [HTTP_PROVIDERS,PeService,ConfigService]
})

export class PeComponent {
	displayDialog: boolean;
    pe: Pe = new PrimePe();
    selectedPe: Pe;
    newPe: boolean;
    pes: Pe[];
	postData: string;
	wikiLink: string;
	statusMessage: Message[] = [];
	errorMessage: string;

    constructor(private peService: PeService, private appservice: ConfigService) {}

    ngOnInit() {
		this.statusMessage.push({severity:'info', summary:'Info: ', detail:'Loading collection and site list...'});
        this.peService.getPes().then(pes => {this.pes = pes; this.statusMessage = [];}, 
		error =>  {this.handleError(error);this.errorMessage = <any>error});
		this.appservice.getWikiUrlParam().then(data => {this.wikiLink = data + myGlobals.managePEWiki},
		error =>  {this.handleError(error);this.errorMessage = <any>error});
    }

    showDialogToAdd() {		
        this.newPe = true;
        this.pe = new PrimePe();

		this.displayDialog = true;
    }

    save() {
        if(this.newPe) {
			if (this.peExists(this.pe.collection, this.pe.site, this.pes)) {
				alert("The collection name " + this.pe.collection + " and site " + this.pe.site + " are taken.  Please use different names.");
				//this.statusMessage.push({severity:'error', summary:'Error: ', detail:'Collection/site name is taken.'});
				//this.statusMessage.push({severity:'info', summary:'Info: ', detail:'taken'});
			}
			else {
				this.peService.addNewPe(this.pe)
				.subscribe(
					data => this.postData = JSON.stringify(data),
					error => this.handleError(error),
					() => console.log("Finished")
				);
				this.pes.push(this.pe);

//				this.pe = null;
				this.displayDialog = false;
			}
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

    findSelectedPeIndex(): number {
        return this.pes.indexOf(this.selectedPe);
    }
	
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
}

class PrimePe implements Pe {

    constructor(public collection?, public site?) {}
}

