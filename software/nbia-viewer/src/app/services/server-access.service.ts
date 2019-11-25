import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Properties } from '../../assets/properties';
import { UtilService } from './util.service';
import { CommonService } from './common.service';
import { ActivatedRoute } from '@angular/router';

@Injectable( {
    providedIn: 'root'
} )
export class ServerAccessService{

    getImagesResultsEmitter = new EventEmitter();
    getThumbnailsEmitter = new EventEmitter();
    getImageDrillDownDataErrorEmitter = new EventEmitter();
    getDicomImageErrorEmitter = new EventEmitter();

    API_SERVER_URL = '';
    images = [];
    getThumbnailErrorCount = 0;
    seriesId;

    first;
    last;

    loading = true;

    constructor( private httpClient: HttpClient, private sanitizer: DomSanitizer,
                 private utilService: UtilService, private commonService: CommonService,
                 private route: ActivatedRoute ) {
        this.API_SERVER_URL = location.origin.toString();

        this.seriesId = this.route.snapshot.queryParams['thumbnailSeries'];

        this.timeTest();

    }

    timeTest() {
        let rightThen;
        let len = -1;
        let rightNow = new Date();

        this.getImageDrillDownData().subscribe(
            data => {
                len = data.length;
                rightThen = new Date();
            }
        );
    }


    /**
     * If page has a value, only that page of images is downloaded.
     * We get the current number of images per page from commonService.getImagesPerPage().
     *
     * @param page
     */

    /**
     * If page has a value, only that page of images is downloaded.
     * If page & imageNumber have value, get just one image.
     *
     * We get the current number of images per page from commonService.getImagesPerPage().

     * @param page
     * @param imageNumber
     */
    async getImages( page?, imageNumber? ) {
        this.loading = true;
        this.images = [];
        let len = 99999999;
        this.getImageDrillDownData().subscribe(
            data => {
                len = data.length;
                this.commonService.setImageCount( len );

                this.first = 0;
                this.last = len - 1;


                if( Properties.IMAGE_LOAD_MODE === Properties.LOAD_ONE_PAGE ){
                    if( !this.utilService.isNullOrUndefined( page ) ){
                        this.commonService.setCurrentPage( page );
                    }else{
                        page = 0;
                    }

                    this.first = (+this.commonService.getCurrentPage() * +this.commonService.getImagesPerPage());
                    this.last = this.first + (+this.commonService.getImagesPerPage()) - 1;
                    if( this.last > len ){
                        this.last = len - 1;
                    }
                }

                for( let i = this.first; i <= this.last; i++ ){
                    this.getThumbnails( data[i]['seriesInstanceUid'], data[i]['sopInstanceUid'], this.getToken() ).subscribe(
                        thumbnailData => {
                            this.images.push(
                                {
                                    'thumbnailImage': this.sanitizer.bypassSecurityTrustUrl( window.URL.createObjectURL( thumbnailData ) ),
                                    'seriesInstanceUid': data[i]['seriesInstanceUid'],
                                    'sopInstanceUid': data[i]['sopInstanceUid'],
                                    'studyInstanceUid': data[i]['studyInstanceUid'],
                                    'seq': i
                                }
                            );
                        },

                        // If we could not get the thumbnail from the server,
                        // we still want to display the frame with the "View Image" button
                        // because the DICOM image may still there.
                        thumbnailError => {
                            console.log('MHL 00 thumbnailError: ', thumbnailError);
                            // We need this count when we are waiting for all the images (by count) to arrive before moving on
                            this.getThumbnailErrorCount++;

                            // Add a "we can't find it" image.
                            this.images.push(
                                {
                                    'thumbnailImage': 'assets/images/image_not_found.png',
                                    'seriesInstanceUid': data[i]['seriesInstanceUid'],
                                    'sopInstanceUid': data[i]['sopInstanceUid'],
                                    'studyInstanceUid': data[i]['studyInstanceUid'],
                                    'seq': i
                                }
                            );
                            // this.getThumbnailsEmitter.emit( thumbnailError );
                        }
                    );
                }
                this.loading = false;
            },
            err => {
                console.log( 'MHL 01 getImageDrillDownData err: ', err );
                this.loading = false;
                this.getImageDrillDownDataErrorEmitter.emit( err );

            }
        );

        // Wait until we have all the images.
        this.commonService.setHaveAllData( false );

        if( Properties.IMAGE_LOAD_MODE === Properties.LOAD_ALL ){
            while( (this.images.length + this.getThumbnailErrorCount) < len ){
                await this.utilService.sleep( Properties.WAIT_TIME );
            }
        }else{
            while( this.loading || ((this.images.length + this.getThumbnailErrorCount) < (this.last - this.first)) ){
                await this.utilService.sleep( Properties.WAIT_TIME );
            }
        }
        this.commonService.setHaveAllData( true );

        // Sort by seq here - need to sort, they may not have arrived from the server in the order they where requested.
        this.images.sort( ( row1, row2 ) => (row1.seq - row2.seq) );

        this.getImagesResultsEmitter.emit( this.images );

    }

    getImageDrillDownData(): Observable<any> {
        let query = 'list=' + this.seriesId;

        if( Properties.DEBUG_CURL ){
            let curl = ' curl -H \'Authorization:Bearer  ' + this.getToken() + '\' -k \'' + this.API_SERVER_URL + '/nbia-api/services/getImageDrillDown\' -d \'list=' + query + '\'';
            console.log( 'doPost: ', curl );
        }

        let imageDrillDownUrl = this.API_SERVER_URL + '/nbia-api/services/getImageDrillDown';
        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.getToken()
        } );

        let options = {
            headers: headers,
        };
        return this.httpClient.post( imageDrillDownUrl, query, options );
    }


    getThumbnails( seriesUid, objectId, accessToken ): Observable<any> {
        let post_url = this.API_SERVER_URL + '/nbia-api/services/getThumbnail';
        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer  ' + this.getToken()
        } );

        let data = 'seriesUID=' + seriesUid + '&objectUID=' + objectId;
        let dataTemp = 'seriesUID=' + this.seriesId + '&objectUID=' + objectId;


        if( Properties.DEBUG_CURL ){
            let curl = 'curl -H \'Authorization:Bearer ' + this.getToken() + '\' -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
            console.log( 'doGet: ' + curl );
        }

        let options =
            {
                headers: headers,
                method: 'post',
                responseType: 'blob' as 'blob'
            };
        return this.httpClient.post( post_url, data, options );
    }


    downLoadDicomImageFile( seriesUID, objectUID, studyUID ) {

        this.getDicomImage( seriesUID, objectUID, studyUID ).subscribe(
            data => {
                let dicomFile = new Blob( [data], { type: 'application/dicom' } );

                // TODO in the download popup, it says 'from: blob:'  see if we can change this.
                let url = (<any>window).URL.createObjectURL( dicomFile );
                (<any>window).open( url );
            },
            err => {
                console.error( 'Error downloading DICOM: ', err );
                this.getDicomImageErrorEmitter.emit( err );
            }
        );
    }

    getDicomImage( seriesUID, objectUID, studyUID ): Observable<any> {
        let post_url = this.API_SERVER_URL + '/nbia-api/services/getWado';
        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer  ' + this.getToken()
        } );

        let data = 'seriesUID=' + seriesUID + '&objectUID=' + objectUID + '&studyUID=' + studyUID + '&requestType=WADO';

        if( Properties.DEBUG_CURL ){
            let curl = 'curl  -v -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
            console.log( 'doGet: ' + curl );
        }

        let options =
            {
                headers: headers,
                method: 'post',
                responseType: 'blob' as 'blob'
            };
        return this.httpClient.post( post_url, data, options );
    }


    /**
     * Requests an Access token from the API server.
     *
     * @returns {Observable<R>}
     */
    getNewServerAccessToken(): Observable<any> {

        let post_url = this.API_SERVER_URL + '/nbia-api/oauth/token';
        let headers = new HttpHeaders( { 'Content-Type': 'application/x-www-form-urlencoded' } );

        let data = 'username=' + Properties.API_SERVER_USER_DEFAULT +
            '&password=' + Properties.API_SERVER_PASSWORD_DEFAULT +
            '&client_id=nbiaRestAPIClient&client_secret=' + Properties.API_CLIENT_SECRET_DEFAULT +
            '&grant_type=password';

        /*
               if( Properties.DEBUG_CURL ){
                   let curl = 'curl -v -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
                   console.log( 'getAccessToken: ' + curl );
               }
       */
        let options =
            {
                headers: headers,
                method: 'post'
            };
        return this.httpClient.post( post_url, data, options );
    }

    getToken() {
        return this.commonService.getPersistedValue( 'at' );
    }

}
