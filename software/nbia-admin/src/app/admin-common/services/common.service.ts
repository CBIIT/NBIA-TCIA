import { EventEmitter, Injectable } from '@angular/core';
import { UtilService } from './util.service';

@Injectable( {
    providedIn: 'root'
} )
export class CommonService{

    showCriteriaSelectionMenuEmitter = new EventEmitter();
	downloadCartAsCsvEmitter = new EventEmitter();

    constructor(private utilService: UtilService) {
    }

    showCriteriaSelectionMenu( show ) {
        this.showCriteriaSelectionMenuEmitter.emit( show );
    }
    /**
     * Called when the "Export spreadsheet" button on the Series Info screen.
     * This emitter is subscribed to by the CartComponent
     *
     * @param cartList Same date we display in the Cart screen @TODO Make sure this is all the data we want
     */
    downloadCartAsCsv( seriesList ) {
        // Make sure we have data.
        if( !this.utilService.isNullOrUndefined( seriesList ) ){
            this.downloadCartAsCsvEmitter.emit( seriesList );
        }
    }
	
}
