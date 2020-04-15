import { EventEmitter, Injectable } from '@angular/core';
import { Consts, TokenStatus } from '@app/constants';
import { Properties } from '@assets/properties';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { UtilService } from './util.service';

@Injectable( {
    providedIn: 'root'
} )
export class AccessTokenService{

    tokenStatus = -1;
    accessToken = TokenStatus.NO_TOKEN_YET;
    tokenStatusChangeEmitter = new EventEmitter();


    constructor( private httpClient: HttpClient, private utilService: UtilService ) {
    }


    /**
     * Gets an Access token from the server
     * @param user
     * @param password
     */
    getAccessTokenFromServer( user, password ) {
        this.setAccessTokenStatus( TokenStatus.NO_TOKEN_YET );
        let post_url = Properties.API_SERVER_URL + '/' + Consts.API_ACCESS_TOKEN_URL;
        let headers = new HttpHeaders( { 'Content-Type': 'application/x-www-form-urlencoded' } );
        let data = 'username=' + user + '&password=' + password + '&client_id=nbiaRestAPIClient&client_secret=' + Consts.API_CLIENT_SECRET_DEFAULT + '&grant_type=password';
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
                this.setAccessTokenStatus( TokenStatus.HAVE_TOKEN );
            },
            err => {
                console.error('Get new token error: ', err);
                this.setAccessTokenStatus( TokenStatus.BAD_TOKEN );
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

    setAccessTokenStatus( s ){
        if( this.tokenStatus !== s){
            this.tokenStatus = s;
            this.tokenStatusChangeEmitter.emit( this.tokenStatus);
        }
    }


    getAccessToken() {
        return this.accessToken;
    }

    setAccessToken( token ) {
        this.accessToken = token;
    }

    testToken( token ? ) {
        if( this.utilService.isNullOrUndefinedOrEmpty( token )){
            token = this.accessToken;
        }

        this.setAccessTokenStatus(TokenStatus.NO_TOKEN_YET);

        // Is there a token to test
        if( this.utilService.isNullOrUndefinedOrEmpty( token ) ){
            this.setAccessTokenStatus(TokenStatus.NO_TOKEN);
        }else
            // Test the token by trying to get the user roles.
            {
            this.doGet( Consts.GET_USER_ROLES ).subscribe(
                ( collectionDescriptionsData ) => {
                    this.setAccessTokenStatus(TokenStatus.GOOD_TOKEN);
                },
                collectionDescriptionsError => {
                    if( collectionDescriptionsError.status === 401 ){
                        this.setAccessTokenStatus(TokenStatus.EXP_TOKEN);
                    }else{
                        this.setAccessTokenStatus(TokenStatus.BAD_TOKEN);
                    }
                } );
        }

    }

    doGet( queryType ) {
        let getUrl = Properties.API_SERVER_URL + '/nbia-api/services/' + queryType;

        if( Properties.DEBUG_CURL ){
            let curl = 'curl -H \'Authorization:Bearer  ' + this.accessToken + '\' -k \'' + getUrl + '\'';
            console.log( 'doGet: ' + curl );
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

}
