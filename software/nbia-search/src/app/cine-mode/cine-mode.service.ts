import { EventEmitter, Injectable } from '@angular/core';
import { Consts } from '@app/consts';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { takeUntil } from 'rxjs/operators';
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
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiServerService: ApiServerService ) {

/*
        this.apiServerService.getDicomTagsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( data['id'] === this.seriesUID && this.showCineModeToggle ){
                    this.dicomData = data['res'];
                    console.log( 'MHL 001 dicom: ', this.dicomData );
                    this.sendCineModeDataEmitter.emit( {
                        'seriesUID': this.seriesUID,
                        'seriesId': this.seriesId,
                        'dicomData': this.dicomData,
                        'seriesDescription': this.seriesDescription
                    } ); // @FIXME  MHL do not need to pass along seriesUID?
                }
            }
        );
*/


    }

    openCineMode0( seriesUID, seriesId, description ) { // @FIXME  MHL do not need dicomData
        this.displayCineModeImagesEmitter.emit( true );
        this.seriesUID = seriesUID;
        this.seriesId = seriesId;
        this.seriesDescription = description;
        let query = 'SeriesUID=' + seriesUID;
        this.showCineModeToggle = true;
        this.apiServerService.dataGet( Consts.DICOM_TAGS, query );
    }

    openCineMode( seriesUID, seriesId, description, studyDate ) { // @FIXME  MHL do not need dicomData
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
