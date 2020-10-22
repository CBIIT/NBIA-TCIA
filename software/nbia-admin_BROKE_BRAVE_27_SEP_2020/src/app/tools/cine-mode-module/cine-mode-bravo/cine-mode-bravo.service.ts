import { EventEmitter, Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )


export class CineModeBravoService{
    seriesDescription;
    displayCineModeBravoImagesEmitter = new EventEmitter();
    closeCineModeEmitter = new EventEmitter();
    hideCineModeEmitter = new EventEmitter();
    getDicomTagsByImageEmitter = new EventEmitter();

    hideCine = false;
    constructor() {
    }

    openCineMode( series, collectionSite, searchResultsIndex ) {
        this.displayCineModeBravoImagesEmitter.emit( { series, collectionSite, searchResultsIndex } );
        this.hideCineMode(false);
    }

    hideCineMode( s? ) {
        if( s === undefined)
        {
            this.hideCine = ! this.hideCine;
        }else{
            this.hideCine = s;
        }
        this.hideCineModeEmitter.emit(this.hideCine);
    }

    closeCineMode() {
        this.closeCineModeEmitter.emit();
    }

}
