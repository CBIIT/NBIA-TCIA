import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayDynamicQueryService {
    displayDynamicQueryEmitter = new EventEmitter();
    clearDynamicQuerySectionQueryEmitter = new EventEmitter();
    displayDynamicQuery = '';

  constructor() { }

    query( q ) {
        this.displayDynamicQueryEmitter.emit( q );
    }

    clearQuerySectionQuery() {
      console.log('MHL DisplayDynamicQueryService clearQuerySectionQuery');
        this.clearDynamicQuerySectionQueryEmitter.emit();
    }

}
