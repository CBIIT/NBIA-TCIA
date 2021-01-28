import { Injectable } from '@angular/core';
import { DynamicCriteria } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-criteria-list/dynamic-criteria';

@Injectable( {
    providedIn: 'root'
} )
export class DynamicCriteriaListService{

    dynamicCriteriaList: DynamicCriteria[] = []

    constructor() {
    }

    /**
     * Add a query to the top of the list.
     *
     * @param dynamicCriteria
     */
    addCriteria( dynamicCriteria: DynamicCriteria ){
        this.dynamicCriteriaList.reverse();
        this.dynamicCriteriaList.push(dynamicCriteria);
        this.dynamicCriteriaList.reverse();
    }
}
