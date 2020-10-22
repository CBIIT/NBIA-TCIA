import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformQcService {

    qcHistorySearchResults = {};
    qcHistorySearchResultsEmitter = new EventEmitter();

    constructor() { }

    setQcHistorySearchResults( searchResults){
        this.qcHistorySearchResults = searchResults;
        this.qcHistorySearchResultsEmitter.emit(this.qcHistorySearchResults);
    }

    getQcHistorySearchResults(){
        return this.qcHistorySearchResults;
    }
}
