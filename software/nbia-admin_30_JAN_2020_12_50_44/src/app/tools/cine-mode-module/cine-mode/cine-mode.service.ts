import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from '../../../admin-common/services/api.service';

@Injectable({
  providedIn: 'root'
})


export class CineModeService {
    seriesId;
    seriesUID;
    seriesDescription;
    displayCineModeImagesEmitter = new EventEmitter();
    sendCineModeDataEmitter = new EventEmitter();
    showCineModeToggle = false;

  constructor( private apiService: ApiService) { }

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


}
