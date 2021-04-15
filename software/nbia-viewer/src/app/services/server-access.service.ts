import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Properties } from '../../assets/properties';
import { UtilService } from './util.service';
import { CommonService } from './common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout } from 'rxjs/operators';

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

    token;
    refreshToken;
    expiresIn;
    tokenRefreshCycleRunning = false;

    loading = true;

    constructor( private httpClient: HttpClient, private sanitizer: DomSanitizer,
                 private utilService: UtilService, private commonService: CommonService,
                 private route: ActivatedRoute, private router: Router
    ) {
        this.API_SERVER_URL = location.origin.toString();

        this.seriesId = this.route.snapshot.queryParams['thumbnailSeries'];


        this.token = this.commonService.getPersistedValue( 'at' );
        console.log('MHL this.token: ', this.token);

        this.initToken();
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
        console.log( 'MHL getImages 010' );
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
                    this.getThumbnails( data[i]['seriesInstanceUid'], data[i]['sopInstanceUid'] ).subscribe(
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
                            console.log( 'ThumbnailError: ', thumbnailError );
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
        console.log( 'MHL getImageDrillDownData' );

        let query = 'list=' + this.seriesId;

        if( Properties.DEBUG_CURL ){
            let curl = ' curl -H \'Authorization:Bearer  ' + this.getToken() + '\' -k \'' + this.API_SERVER_URL + '/nbia-api/services/getImageDrillDown\' -d \'' + query + '\'';
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


    getThumbnails( seriesUid, objectId ): Observable<any> {
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
     * Requests an Access token from the API server, Using the guest settings (Viewer never has the users name & password).
     *
     * @returns {Observable<any>}
     */
    getNewGuestServerAccessToken(): Observable<any> {
        console.log( 'MHL getNewGuestServerAccessToken' );
        let post_url = this.API_SERVER_URL + '/nbia-api/oauth/token';
        let headers = new HttpHeaders( { 'Content-Type': 'application/x-www-form-urlencoded' } );

        let data = 'username=' + Properties.DEFAULT_USER +
            '&password=' + Properties.DEFAULT_PASSWORD +
            '&client_id=nbiaRestAPIClient&client_secret=' + Properties.DEFAULT_SECRET +
            '&grant_type=password';


        if( Properties.DEBUG_CURL ){
            let curl = 'curl -v -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
            console.log( 'getNewGuestServerAccessToken: ' + curl );
        }

        let options =
            {
                headers: headers,
                method: 'post'
            };
        return this.httpClient.post( post_url, data, options );
    }

    /**
     *
     * @param t
     */
    initToken() {
        console.log('MHL 010 initToken: ', this.route.snapshot.queryParams['accessToken']);


        // Get access token
            let tokens = this.route.snapshot.queryParams['accessToken'];
            if( tokens !== undefined){
                console.log('MHL 011 initToken: ', tokens);

                tokens = tokens.split( ':' );
                this.token = tokens[0];
                this.refreshToken = tokens[1];
                this.expiresIn = tokens[2];


                this.startRefreshTokenCycle();

              //  this.setToken( this.token );
 /*               this.accessTokenService.setRefreshToken( this.refreshToken );
                this.accessTokenService.setExpiresIn( this.expiresIn );

                this.accessTokenService.startRefreshTokenCycle();
*/
            }



            /*
                    if( this.route.snapshot.queryParams['token'] !== undefined ){
                        this.setToken( this.route.snapshot.queryParams['token'] );
                        console.log( 'MHL Using URL token: ', this.token );
                    }else if( this.route.snapshot.queryParams['token'] !== undefined ){
                        this.setToken( this.route.snapshot.queryParams['token'] );
                        console.log( 'MHL Using Cookie token: ', this.token );
                    }else{
                        // Put login here
                        console.log( 'MHL Using NO TOKEN' );
                    }
            */
    }



    startRefreshTokenCycle(){
        let tempCounter = 0;
        if( ! this.tokenRefreshCycleRunning ){
            console.log('MHL startRefreshTokenCycle');
            this.tokenRefreshCycleRunning = true;
            let cycleTimeSeconds = this.expiresIn - Properties.TOKEN_REFRESH_TIME_MARGIN;
            setInterval(() => {
                console.log('MHL refresh[' + cycleTimeSeconds + ']: ' + new Date() + '  ' + tempCounter++);
                this.getAccessTokenWithRefresh( this.getRefreshToken() );

            }, this.getExpiresIn() * 1000);
        }
    }

    /**
     * Gets an Access token from the server using a refresh token
     * @param user
     * @param password
     */
    getAccessTokenWithRefresh( refreshToken ) {
        let post_url = this.API_SERVER_URL + '/nbia-api/oauth/token';


        let headers = new HttpHeaders( { 'Content-Type': 'application/x-www-form-urlencoded' } );
        let data = 'client_id=nbiaRestAPIClient&client_secret=' + Properties.DEFAULT_SECRET + '&grant_type=refresh_token&refresh_token=' + refreshToken;

        if( Properties.DEBUG_CURL ){
            let curl = 'curl  -v -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
            console.log( 'getAccessToken: ' + curl );
        }

        let options =
            {
                headers: headers,
                method: 'post'
            };

        this.httpClient.post( post_url, data, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) ).subscribe(
            accessTokenData => {
                this.setToken( accessTokenData['access_token'] );
                this.setRefreshToken( accessTokenData['refresh_token'] );
                this.setExpiresIn( accessTokenData['expires_in'] );

                console.log('MHL refreshToken AccessToken: ', this.getToken());
                console.log('MHL refreshToken RefreshToken: ', this.getRefreshToken());
                console.log('MHL refreshToken ExpiresIn: ', this.getExpiresIn());


                // If the token was passed to us in the URL, we need to update that URL when the token changes (so refreshing the page won't keep prompting for login).
                if( Properties.HAVE_URL_TOKEN ){
                    console.log('MHL IN getAccessTokenWithRefresh CALLING:  appendAQueryParam(' +  this.getToken() + ':' + this.getRefreshToken() + ':' + this.getExpiresIn() + ')' );
                    this.appendAQueryParam( this.getToken() + ':' + this.getRefreshToken() + ':' + this.getExpiresIn() );
                }

            },
            err => {
                console.error( 'Get new token with refresh token error: ', err );
                // @FIXME Inform user
            }
        )
    }


    /**
     * Updates the URL at the top of the browser with a new token string.
     *
     * @param tokenString Access token: refresh token: token life span in seconds
     */
    appendAQueryParam( tokenString ) {
        console.log('MHL UPDATE URL: ', tokenString);

        let urlTree = this.router.createUrlTree([], {
            queryParams: { accessToken: tokenString },
            queryParamsHandling: "merge",
            preserveFragment: true });
        this.router.navigateByUrl(urlTree);
    }



    setToken( t ) {
        this.token = t;
    }

    getToken() {
        return this.token;
    }

    setRefreshToken( token ) {
        this.refreshToken = token;
    }

    getRefreshToken(  ) {
        return this.refreshToken;
    }

    setExpiresIn( expIn ) {
        this.expiresIn = expIn;
    }

    getExpiresIn(  ) {
        return this.expiresIn;
    }


}
