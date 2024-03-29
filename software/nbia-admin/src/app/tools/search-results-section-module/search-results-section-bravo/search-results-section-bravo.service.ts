import { EventEmitter, Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )
export class SearchResultsSectionBravoService{

    selectionChangeEmitter = new EventEmitter();

    constructor(){
    }

    selectionChange( searchResults ){
        this.selectionChangeEmitter.emit( searchResults );
    }
}
