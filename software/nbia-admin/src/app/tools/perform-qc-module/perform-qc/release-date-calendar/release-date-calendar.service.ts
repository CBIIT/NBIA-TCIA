// @TODO Move this higher, it is going to bw used by cine-mode-module/qc-status-edit too

import { EventEmitter, Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )
export class ReleaseDateCalendarService{
    releaseDateEmitter = new EventEmitter();
    releaseDate;
    showPopupCalendarEmitter = new EventEmitter();
    showPopupCalendarFlag = false;

    constructor(){
    }

    setReleaseDate( d ){
        this.releaseDate = d;
        this.releaseDateEmitter.emit( d );
    }

    getReleaseDate(){
        return this.releaseDate;
    }

    showPopupCalendar( show ){
        this.showPopupCalendarFlag = show;
        this.showPopupCalendarEmitter.emit( show );
    }

}
