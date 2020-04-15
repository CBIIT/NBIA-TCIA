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
        console.log('MHL 000 CineModeService calling displayCineModeImagesEmitter.emit');
        this.displayCineModeImagesEmitter.emit( {series, collectionSite, searchResultsIndex} );
    }

    closeCineMode(){
        this.closeCineModeEmitter.emit();
    }

}
