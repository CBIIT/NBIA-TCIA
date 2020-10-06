// ----------------------------------------------------------------------------------------
// ----------  Service to update Display Query and clear all query criteria    ------------
// ----------------------------------------------------------------------------------------

import { EventEmitter, Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root',
} )
export class DisplayQueryService{
    displayQueryEmitter = new EventEmitter();
    clearQuerySectionQueryEmitter = new EventEmitter();
    displayQuery = '';

    constructor() {
    }

    query( q ) {
        this.displayQueryEmitter.emit( q );
    }

    clearQuerySectionQuery() {
        this.clearQuerySectionQueryEmitter.emit();
    }
}
