import { Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )
export class CriteriaSelectionMenuService{
    elementsUsed:boolean[][] = [[],[],[],[],[],[],[],[],[],[],[],[]]; // TODO There has to be a better way

    constructor() {

    }

    initElementsUsed( criteriaData ) {
        for( let n = 0; n < criteriaData['data'].length; n++ ){
            for( let i = 0; i < criteriaData['data'][n]['criteriaObjects'].length; i++ ){
                this.elementsUsed[n][i] = false;
            }
        }
    }

    getElementsUsed() {
        return this.elementsUsed;
    }

    addElementUsed( i, n ) {
        this.elementsUsed[i][n] = true;
    }

    removeElementUsed( i, n ) {
        this.elementsUsed[i][n] = false;

    }
}
