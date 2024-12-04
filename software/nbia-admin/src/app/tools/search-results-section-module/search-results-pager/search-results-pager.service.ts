import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsPagerService {
    currentPageChangeEmitter  = new EventEmitter();
    pageCountEmitter  = new EventEmitter();
    pageLengthEmitter  = new EventEmitter();
    nextPageEmitter  = new EventEmitter();
    previousPageEmitter  = new EventEmitter();

    pageCount = 0;

    constructor() { }

    setPageCount( pc ){
        this.pageCount = pc;
        this.pageCountEmitter.emit(this.pageCount);
    }

    getPageCount(){
        return this.pageCount;
    }

    goToNextPage(){
        this.nextPageEmitter.emit();
    }

    goToPreviousPage(){
        this.previousPageEmitter.emit();
    }
}
