// -------------------------------------------------------------------------
// -------        "Service to open & close Cine Mode viewer"          ------
// -------------------------------------------------------------------------

import { EventEmitter, Injectable } from '@angular/core';
import { Properties } from '@assets/properties';

@Injectable( {
    providedIn: 'root',
} )
export class CineModeBravoService{
    seriesDescription;
    displayCineModeBravoImagesEmitter = new EventEmitter();
    closeCineModeEmitter = new EventEmitter();
    hideCineModeEmitter = new EventEmitter();
    getDicomTagsByImageEmitter = new EventEmitter();

    series = {};
    collectionSite = '';
    searchResultsIndex = 0;

    properties = Properties;

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

        // For "Next/Skip" we don't always have collectionSite  @TODO clean this up so that we don't bother sending/receiving collectionSite, it is in series['collectionSite']
        if( collectionSite == null || collectionSite.length < 1){
            collectionSite = series['collectionSite'];
        }
        this.displayCineModeBravoImagesEmitter.emit( {
            series,
            collectionSite,
            searchResultsIndex,
        } );
        this.series = series;
        this.collectionSite = collectionSite;
        this.searchResultsIndex = searchResultsIndex;
        this.hideCineMode( false );
    }

    getSeries() {
        return this.series;
    }

    getCollectionSite() {
        return this.collectionSite;
    }

    getSearchResultsIndex() {
        return this.searchResultsIndex;
    }

    /**
     * Hide or show Cine mode, but leave it intact.
     *
     * @param s true show, false to hide.
     * @see SearchResultsSectionBravoComponent.hideShowCineMode()
     */
    hideCineMode( s? ) {
        if( s == null ){
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
