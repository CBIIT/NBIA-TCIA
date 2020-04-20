import { EventEmitter, Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )


export class CineModeService{
    seriesDescription;
    displayCineModeImagesEmitter = new EventEmitter();
    closeCineModeEmitter = new EventEmitter();
    getDicomTagsByImageEmitter = new EventEmitter();

    constructor() {
    }

    openCineMode(  series, collectionSite, searchResultsIndex ) {
        this.displayCineModeImagesEmitter.emit( {series, collectionSite, searchResultsIndex} );
    }

    closeCineMode(){
        this.closeCineModeEmitter.emit();
    }

}
