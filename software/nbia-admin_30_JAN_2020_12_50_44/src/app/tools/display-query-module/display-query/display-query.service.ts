import { EventEmitter, Injectable } from '@angular/core';
import { Consts } from '../../../constants';

@Injectable( {
    providedIn: 'root'
} )
export class DisplayQueryService{
    displayQueryEmitter = new EventEmitter();
    clearQuerySectionQueryEmitter = new EventEmitter();
    displayQuery = '';

    constructor() {
    }

    query( q ) {
        console.log('MHL DISPLAY Q input: ', q);
        this.displayQueryEmitter.emit( q );

    }

    clearQuerySectionQuery(){
        this.clearQuerySectionQueryEmitter.emit();
    }

}
