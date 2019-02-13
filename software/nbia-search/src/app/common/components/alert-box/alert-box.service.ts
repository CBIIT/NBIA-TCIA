import { EventEmitter, Injectable } from '@angular/core';
import { UtilService } from '@app/common/services/util.service';

@Injectable()
export class AlertBoxService{
    alertBoxEmitter = new EventEmitter();
    alertBoxReturnEmitter = new EventEmitter();


    constructor() {
    }

    /**
     * This will display the Alert box, and notify every thing that needs to disable until the Alert box closes
     *
     * @param id
     * @param type
     * @param title
     * @param text
     * @param buttons
     * @param width
     * @returns {Promise<void>}
     */
    async alertBoxDisplay( id, type, title, text, buttons, width ? ) {
        this.alertBoxEmitter.emit( { id, type, title, text, buttons, width } );
    }

}
