import { EventEmitter, Injectable, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DynamicQueryCriteriaService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service';
import { Subject } from 'rxjs';

@Injectable( {
    providedIn: 'root'
} )
export class CriteriaSelectionMenuService implements OnDestroy{
    elementsUsed:boolean[][] = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]; // TODO There has to be a better way


    criteriaData;
    requiredCriteriaData;
    requiredCriteriaDataEmitter = new EventEmitter();

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

    setRequiredCriteriaData( reqData){
        this.requiredCriteriaData = reqData;
        this.requiredCriteriaDataEmitter.emit(this.requiredCriteriaData); // @FIXME we don't use/need this
    }

    getRequiredCriteriaData(){
        return this.requiredCriteriaData;
    }

    removeElementUsed( i, n ) {
        this.elementsUsed[i][n] = false;

    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
