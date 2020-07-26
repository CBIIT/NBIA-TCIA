import { EventEmitter, Injectable } from '@angular/core';
import { Consts } from '@app/consts';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Subject } from 'rxjs';

@Injectable( {
    providedIn: 'root'
} )
export class CineModeService{
    seriesId;
    seriesUID;
    seriesDescription;
    displayCineModeImagesEmitter = new EventEmitter();
    sendCineModeDataEmitter = new EventEmitter();
    dicomData;
    showCineModeToggle = false;

    constructor( private apiServerService: ApiServerService ) {}

    openCineMode( seriesUID, seriesId, description, studyDate ) {
        this.displayCineModeImagesEmitter.emit( true );
        this.seriesUID = seriesUID;
        this.seriesId = seriesId;
        this.seriesDescription = description;
        this.showCineModeToggle = true;

        this.sendCineModeDataEmitter.emit( {
            'seriesUID': seriesUID,
            'seriesId': seriesId,
            'dicomData': [],
            'seriesDescription': description,
            'studyDate': studyDate
        });
    }

    closeCineMode() {
        this.showCineModeToggle = false;
    }
}
