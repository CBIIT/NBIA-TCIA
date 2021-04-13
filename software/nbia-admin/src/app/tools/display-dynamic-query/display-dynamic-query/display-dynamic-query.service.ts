import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DisplayDynamicQueryService {
    displayDynamicQueryEmitter = new EventEmitter();
    clearDynamicQuerySectionQueryEmitter = new EventEmitter();
    displayDynamicQuery = '';

  constructor( ) { }

    query( q ) {
        this.displayDynamicQueryEmitter.emit( q );
    }

    clearQuerySectionQuery() {
        this.clearDynamicQuerySectionQueryEmitter.emit();

    }

}
