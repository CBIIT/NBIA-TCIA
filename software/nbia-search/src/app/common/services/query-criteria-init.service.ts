import { Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )
export class QueryCriteriaInitService{
    pendingCount = -1;
    queryCountNumber = 4;
    queryCountTotal = 0;

    constructor() {
    }


    startQueryCriteriaInit() {
        if( this.pendingCount === -1 ){
            this.pendingCount = 1;
        }else{
            this.pendingCount++;
            this.queryCountTotal++;
        }
    }

    endQueryCriteriaInit() {
        this.pendingCount--;
    }

    isQueryCriteriaInitComplete() {
        if( (this.queryCountTotal === this.queryCountNumber) && (this.pendingCount < 1) )
        {
            this.queryCountTotal = 0;
            return true;
        } else{
            return false;
        }
    }

}
