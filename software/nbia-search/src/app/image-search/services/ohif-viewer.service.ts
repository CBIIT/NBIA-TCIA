import { Injectable } from '@angular/core';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';
import { CommonService } from '@app/image-search/services/common.service';
import { Properties } from '@assets/properties';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilService } from '@app/common/services/util.service';

@Injectable( {
    providedIn: 'root'
} )
export class OhifViewerService{

    constructor( private apiServerService: ApiServerService, private loadingDisplayService: LoadingDisplayService,
                 private commonService: CommonService, private httpClient: HttpClient,
                 private utilService: UtilService ) {

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

    // No longer used  TODO can probably delete
    getOhifJson( ...args: any[] ) {
        let accessToken = this.apiServerService.showToken();

        // Properties.OHIF_SERVER_URL =  Properties.API_SERVER_URL;
        let getUrl = Properties.OHIF_SERVER_URL + '/studies/' + args[0] + '/series/' + args[1] ;
        console.log( 'MHL getOhifJson getUrl: ', getUrl );

        if( Properties.DEBUG_CURL ){
            let curl = 'curl -H \'Authorization:Bearer  ' + accessToken + '\' -k \'' + getUrl + '\'';
            console.log( 'doGet: ' + curl );
        }

        if( this.utilService.isNullOrUndefined( accessToken ) ){
            accessToken = accessToken;
        }

        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + accessToken
        } );

        let options = {
            headers: headers,
            method: 'get',
        };

        let results;
        try{
            results = this.httpClient.get( getUrl, options );
        }catch( e ){
            console.error( 'doGet Exception: ' + e );
        }

        return results;

    }

}
