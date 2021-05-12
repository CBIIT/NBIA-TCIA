import { EventEmitter, Injectable } from '@angular/core';
import { Consts, TokenStatus } from '@app/constants';
import { Properties } from '@assets/properties';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { UtilService } from './util.service';
import { Router } from '@angular/router';

@Injectable( {
    providedIn: 'root'
} )
export class AccessTokenService{

    tokenStatus = -1;
    accessToken = TokenStatus.NO_TOKEN_YET;
    refreshToken = TokenStatus.NO_TOKEN_YET;
    expiresIn;
    currentUser = '';
    currentPassword = '';

    tokenRefreshCycleRunning = false;

    tokenStatusChangeEmitter = new EventEmitter();

    currentlyGettingToken = false;
    interval = 20;

    constructor( private httpClient: HttpClient, private utilService: UtilService,
                 private router: Router) {
     }

    startRefreshTokenCycle(){
        if( ! this.tokenRefreshCycleRunning ){
           // console.log('MHL startRefreshTokenCycle');
            this.tokenRefreshCycleRunning = true;
            let cycleTimeSeconds = this.expiresIn - Properties.TOKEN_REFRESH_TIME_MARGIN;
            setInterval(() => {
                this.getAccessTokenWithRefresh( this.getRefreshToken() );
            }, cycleTimeSeconds * 1000);
        }
/*
        else{
            console.log('MHL IN startRefreshTokenCycle, but we don\'t need it');
        }
*/
    }


    /**
     * Updates the URL at the top of the browser with a new token string.
     *
     * @param tokenString Access token: refresh token: token life span in seconds
     */
    appendAQueryParam( tokenString ) {

        let urlTree = this.router.createUrlTree([], {
            queryParams: { accessToken: tokenString },
            queryParamsHandling: "merge",
            preserveFragment: true });
        this.router.navigateByUrl(urlTree);
    }

    /**
     * Gets an Access token from the server
     * @param user
     * @param password
     */
    getAccessTokenFromServer( user, password ) {
        if( this.currentlyGettingToken ){
            return;
        }

        if( user.length > 0 && password.length > 0 ){
            this.currentlyGettingToken = true;
            this.setAccessTokenStatus( TokenStatus.NO_TOKEN_YET );

            let post_url = Properties.API_SERVER_URL + '/' + Consts.API_ACCESS_TOKEN_URL;
            let headers = new HttpHeaders( { 'Content-Type': 'application/x-www-form-urlencoded' } );
            let data = 'username=' + user + '&password=' + password + '&client_id=nbiaRestAPIClient&client_secret=' + Properties.DEFAULT_SECRET + '&grant_type=password';

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
                    this.setAccessToken( accessTokenData['access_token'] );
                    this.setRefreshToken( accessTokenData['refresh_token'] );
                    this.setExpiresIn( accessTokenData['expires_in'] );

                    this.setCurrentUser( user );
                    this.setCurrentPassword( password );

                    /* Changing this because the test for good token is not needed
                    this.setAccessTokenStatus( TokenStatus.HAVE_TOKEN );
                    */
                    this.setAccessTokenStatus( TokenStatus.GOOD_TOKEN );

                    // If the token was passed to us in the URL, we need to update that URL when the token changes (so refreshing the page won't keep prompting for login).
                    if( Properties.HAVE_URL_TOKEN ){
                        this.appendAQueryParam( this.getAccessToken() + ':' + this.getRefreshToken() + ':' + this.getExpiresIn() );
                    }

                    this.startRefreshTokenCycle();
                    this.currentlyGettingToken = false;

                },
                err => {
                    console.error( 'Get new token error: ', err );
                    this.setAccessTokenStatus( TokenStatus.BAD_TOKEN );
                    this.currentlyGettingToken = false;
                }
            );

        }
        // END if user length > 0
        else{
            // Get refresh token
            this.getAccessTokenWithRefresh( this.getRefreshToken() );
        }
    }


    /**
     * Gets an Access token from the server using a refresh token
     * @param user
     * @param password
     */
    getAccessTokenWithRefresh( refreshToken ) {
        if( this.currentlyGettingToken ){
            return;
        }
        this.currentlyGettingToken = true;
        this.setAccessTokenStatus( TokenStatus.NO_TOKEN_YET );

        let post_url = Properties.API_SERVER_URL + '/' + Consts.API_ACCESS_TOKEN_URL;
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
                this.setAccessToken( accessTokenData['access_token'] );
                this.setRefreshToken( accessTokenData['refresh_token'] );
                this.setExpiresIn( accessTokenData['expires_in'] );

                this.setAccessTokenStatus( TokenStatus.GOOD_TOKEN );

                // If the token was passed to us in the URL, we need to update that URL when the token changes (so refreshing the page won't keep prompting for login). @CHECKME Let's update the URL even if they didn't have the token in the URL
                    this.appendAQueryParam( this.getAccessToken() + ':' + this.getRefreshToken() + ':' + this.getExpiresIn() );

                this.currentlyGettingToken = false;

            },
            err => {
                console.error( 'Server (httpClient.post) error: ' + err.statusText + ' (' + err['status'] + ') - ' + err.error['error'] );
                this.setAccessTokenStatus( TokenStatus.BAD_TOKEN );
                this.currentlyGettingToken = false;
                alert( 'Server error: ' + err.statusText + ' (' + err['status'] + ') - ' + err.error['error'] );
            }
        )
    }

    /**
     * Possible values for tokenStatus
     NO_TOKEN,
     NO_TOKEN_YET,
     EXP_TOKEN,
     BAD_TOKEN,
     HAVE_TOKEN,
     GOOD_TOKEN
     */
    getAccessTokenStatus() {
        return this.tokenStatus;
    }

    setAccessTokenStatus( s ) {
        if( this.tokenStatus !== s ){
            this.tokenStatus = s;
            this.tokenStatusChangeEmitter.emit( this.tokenStatus );
        }
    }


    getAccessToken() {
        return this.accessToken;
    }

    setAccessToken( token ) {
        this.accessToken = token;
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

    testToken( token ? ) {
        if( this.utilService.isNullOrUndefinedOrEmpty( token ) ){
            token = this.accessToken;
        }

        this.setAccessTokenStatus( TokenStatus.NO_TOKEN_YET );

        // Is there a token to test
        if( this.utilService.isNullOrUndefinedOrEmpty( token ) ){
            this.setAccessTokenStatus( TokenStatus.NO_TOKEN );
        }else
            // Test the token by trying to get the user roles.
        {
            this.doGet( Consts.GET_USER_ROLES ).subscribe(
                ( collectionDescriptionsData ) => {
                    this.setAccessTokenStatus( TokenStatus.GOOD_TOKEN );
                },
                collectionDescriptionsError => {
                    if( collectionDescriptionsError.status === 401 ){
                        this.setAccessTokenStatus( TokenStatus.EXP_TOKEN );
                    }else{
                        this.setAccessTokenStatus( TokenStatus.BAD_TOKEN );
                    }
                } );
        }

    }

    doGet( queryType ) {
        let getUrl = Properties.API_SERVER_URL + '/nbia-api/services/' + queryType;

        if( Properties.DEBUG_CURL ){
            let curl = 'curl -H \'Authorization:Bearer  ' + this.accessToken + '\' -k \'' + getUrl + '\'';
            console.log( curl );
        }

        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.accessToken
        } );

        let options = {
            headers: headers,
            method: 'get',
        };

        let results;
        try{
            results = this.httpClient.get( getUrl, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) );
        }catch( e ){
            // TODO react to error.
            console.error( 'doGet Exception: ' + e );
        }

        return results;
    }


    setCurrentUser( user ) {
        this.currentUser = user;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    setCurrentPassword( pw ) {
        this.currentPassword = pw;
    }

    getCurrentPassword() {
        return this.currentPassword;
    }

}
