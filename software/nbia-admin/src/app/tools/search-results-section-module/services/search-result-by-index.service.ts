import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchResultByIndexService {

    searchResultsByIndexEmitter = new EventEmitter();

    constructor() { }

    // Subscribed to in SearchResultsSectionComponent
  updateCurrentSearchResultByIndex( index ){
      this.searchResultsByIndexEmitter.emit( index );
  }
}
