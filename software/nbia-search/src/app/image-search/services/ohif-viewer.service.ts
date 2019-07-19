import { Injectable } from '@angular/core';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Properties } from '@assets/properties';

@Injectable( {
    providedIn: 'root'
} )
export class OhifViewerService{

    constructor( private apiServerService: ApiServerService) {
    }

    // No longer used  TODO can probably delete
    callOhifViewer( seriesId, studyId){

        let ohifUrl = Properties.OHIF_SERVER_URL + '/studies/' + studyId + '/series/' + seriesId + '?token=' + this.apiServerService.showToken();
        console.log('ohifUrl: ', ohifUrl);
        window.open( ohifUrl, '_blank' );

    }


    launchOhifViewer( seriesId, studyId){

        let ohifUrl = Properties.OHIF_SERVER_URL + '/viewer?study=' + studyId + '&series=' + seriesId + '&token=' + this.apiServerService.showToken();
        console.log('ohifUrl: ', ohifUrl);
        window.open( ohifUrl, '_blank' );

    }

}
