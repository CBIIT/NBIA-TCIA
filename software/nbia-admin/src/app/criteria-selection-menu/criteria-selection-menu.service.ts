import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DynamicQueryCriteriaService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service';
import { Subject } from 'rxjs';

@Injectable( {
    providedIn: 'root'
} )
export class CriteriaSelectionMenuService implements OnDestroy{
    elementsUsed:boolean[][] = [[],[],[],[],[],[],[],[],[],[],[],[]]; // TODO There has to be a better way

    criteriaData;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private dynamicQueryCriteriaService: DynamicQueryCriteriaService) {

        // @CHECKME - Do we need this async?
        this.dynamicQueryCriteriaService.deleteWidgetEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async data => {
// this.resetAnElementUsed( data );
            } );
    }


    resetAnElementUsed( item ) {
        for( let n = 0; n < this.criteriaData.length; n++ ){
            for( let i = 0; i < this.criteriaData[n]['criteriaObjects'].length; i++ ){
                if( (item['criteriaType'] === this.criteriaData[n]['criteriaObjects'][i]['configuration']['criteriaType']) &&
                    (item['inputType'] === this.criteriaData[n]['criteriaObjects'][i]['configuration']['inputType'])){
                    this.elementsUsed[n][i] = false;
                }
            }
        }
    }

    initElementsUsed( criteriaData ) {
        this.criteriaData = criteriaData;
        console.log('MHL initElementsUsed  this.criteriaData: ', this.criteriaData);
        for( let n = 0; n < criteriaData.length; n++ ){
            for( let i = 0; i < criteriaData[n]['criteriaObjects'].length; i++ ){
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
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
