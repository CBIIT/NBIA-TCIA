import { EventEmitter, Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )
export class CommonService{

    showCriteriaSelectionMenuEmitter = new EventEmitter();

    constructor() {
    }

    showCriteriaSelectionMenu( show ) {
        this.showCriteriaSelectionMenuEmitter.emit( show );
    }
}
