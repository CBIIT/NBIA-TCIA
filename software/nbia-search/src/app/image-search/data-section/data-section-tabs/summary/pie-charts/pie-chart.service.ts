import { EventEmitter, Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root',
} )


export class PieChartService{

    // @FIXME this is a work around, the two way binding of showModalityDescription is not getting back through to the parent.
    showDescriptionEmitter = new EventEmitter();

    constructor() {
    }

    setShowDescription( descriptionType, show: boolean ) {
        this.showDescriptionEmitter.emit( { descriptionType, show } );
    }

}
