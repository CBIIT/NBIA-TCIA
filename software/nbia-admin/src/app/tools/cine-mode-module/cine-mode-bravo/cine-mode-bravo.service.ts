// -------------------------------------------------------------------------
// -------        "Service to open & close Cine Mode viewer"          ------
// -------------------------------------------------------------------------

import { EventEmitter, Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root',
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

    /**
     * Pass to the Cine mode viewer all the data it needs to initialize.
     *
     * @param series
     * @param collectionSite
     * @param searchResultsIndex
     */
    openCineMode( series, collectionSite, searchResultsIndex ) {
        this.displayCineModeBravoImagesEmitter.emit( {
            series,
            collectionSite,
            searchResultsIndex,
        } );
        this.hideCineMode( false );
    }

    /**
     * Hide or show Cine mode, but leave it intact.
     *
     * @param s true show, false to hide.
     * @see SearchResultsSectionBravoComponent.hideShowCineMode()
     */
    hideCineMode( s? ) {
        if( s === undefined ){
            this.hideCine = !this.hideCine;
        }else{
            this.hideCine = s;
        }
        this.hideCineModeEmitter.emit( this.hideCine );
    }

    /**
     * Completely clears and closes Cine mode
     */
    closeCineMode() {
        this.closeCineModeEmitter.emit();
    }
}
