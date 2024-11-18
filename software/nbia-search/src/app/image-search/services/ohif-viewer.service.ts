import { Injectable } from '@angular/core';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Properties } from '@assets/properties';

@Injectable( {
    providedIn: 'root'
} )
export class OhifViewerService{

    constructor( private apiServerService: ApiServerService ) {
    }

    // TODO add header with access token
    launchOhifViewerSeries( seriesId, studyId ) {
        let ohifUrl = Properties.OHIF_SERVER_URL + '/' + Properties.OHIF_SERVER_PATH  + '?' + Properties.OHIF_STUDY_PARAMETER + studyId + '&'+ Properties.OHIF_SERIES_PARAMETER + seriesId; 
        console.log( 'ohifUrl: ', ohifUrl );
        window.open( ohifUrl, '_blank' );
    }

    launchOhifViewerStudy( studyId ) {
        let ohifUrl = Properties.OHIF_SERVER_URL + '/' + Properties.OHIF_SERVER_PATH  + '?' + Properties.OHIF_STUDY_PARAMETER + studyId;
        console.log( 'ohifUrl: ', ohifUrl );
        window.open( ohifUrl, '_blank' );
    }

    launchOhifViewerSubject( subject ) {
        let ohifUrl = Properties.OHIF_SERVER_URL + '/' + Properties.OHIF_SERVER_PATH + '?patientID=' + subject + '&token=' + this.apiServerService.showToken();
        console.log( 'ohifUrl: ', ohifUrl );
        window.open( ohifUrl, '_blank' );
    }

}
