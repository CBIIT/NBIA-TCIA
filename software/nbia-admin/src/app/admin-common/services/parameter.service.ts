import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { Consts } from '@app/constants';
import { Properties } from '@assets/properties';
import { UtilService } from './util.service';
import { LoginService } from '@app/login/login.service';
import { AccessTokenService } from './access-token.service';
import { ApiService } from '@app/admin-common/services/api.service';

@Injectable( {
    providedIn: 'root'
} )
export class ParameterService{

    currentTool = Consts.TOOL_NONE;
    token;
    refreshToken;
    expiresIn;

    parameterValuesSet = false;
    currentToolEmitter = new EventEmitter();

    constructor( private route: ActivatedRoute, private httpClient: HttpClient,
                 private utilService: UtilService, private loginService: LoginService,
                 private accessTokenService: AccessTokenService ) {

        if( Properties.DEV_MODE ){
            this.getAccessToken( Properties.DEV_USER, Properties.DEV_PASSWORD, Properties.DEFAULT_SECRET ).subscribe(
                data => {
                    this.token = data['access_token'];
                    this.refreshToken = data['refresh_token'];
                    this.expiresIn = data['expires_in'];

                    this.accessTokenService.setAccessToken( this.token );
                    this.accessTokenService.setExpiresIn( this.expiresIn );
                    this.accessTokenService.setRefreshToken( this.refreshToken );
                    this.initUrlParameters();

                    this.accessTokenService.startRefreshTokenCycle();

                } );
        }else{
            this.initUrlParameters();
        }
    }

    async initUrlParameters() {
        // wait briefly to ensure components that subscribe to these emitters have time to subscribe before the emit.
        await this.utilService.sleep( Consts.waitTime );

        //////////////////////////////////////////////////////////////////////////////////////////
        // Get any URL parameters
        // Get the tool.
        if( (!this.utilService.isNullOrUndefinedOrEmpty( this.route.snapshot.queryParams[Consts.URL_KEY_TOOL] )) &&
            (<string>this.route.snapshot.queryParams[Consts.URL_KEY_TOOL]).length > 0 ){
            this.setCurrentTool( this.route.snapshot.queryParams[Consts.URL_KEY_TOOL] );  // Subject
        }else{
            this.setCurrentTool( Consts.TOOL_NONE );
        }

        // Get access token
        if( !Properties.DEV_MODE ){
            //let tokens = this.route.snapshot.queryParams[Consts.URL_KEY_TOKEN];
            // Attempt to retrieve the tokens from local storage
            let tokens = localStorage.getItem(Consts.URL_KEY_TOKEN);
            if( tokens !== undefined){
                Properties.HAVE_URL_TOKEN = true;

                var tokenParts = tokens.split( ':' );
                this.token = tokenParts[0];
                this.refreshToken = tokenParts[1];
                this.expiresIn = tokenParts[2];

                this.accessTokenService.setAccessToken( this.token );
                this.accessTokenService.setRefreshToken( this.refreshToken );
                this.accessTokenService.setExpiresIn( this.expiresIn );

                this.accessTokenService.startRefreshTokenCycle();

            }
        }

        // We are done initializing.
        this.parameterValuesSet = true;
    }

    haveParameters() {
        return this.parameterValuesSet;
    }

    getCurrentTool() {
        return this.currentTool;
    }

    setCurrentTool( tool ) {
        this.currentTool = tool;
        this.currentToolEmitter.emit( this.currentTool );

    }


    getToken() {
        return this.token;
    }

    // This is for testing DEV mode only  CHECKME
    getAccessToken( user, password, secret ): Observable<any> {
        let post_url = Properties.API_SERVER_URL + '/' + Consts.API_ACCESS_TOKEN_URL;
        let headers = new HttpHeaders( { 'Content-Type': 'application/x-www-form-urlencoded' } );
        let data = 'username=' + user + '&password=' + password + '&client_id=' + Properties.DEFAULT_CLIENT_ID + '&client_secret=' + Properties.DEFAULT_SECRET + '&grant_type=password';

/*      Don't show user and password
        if( Properties.DEBUG_CURL ){
            let curl = 'curl  -v -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
            console.log( 'getAccessToken: ' + curl );
        }
*/

        let options =
            {
                headers: headers,
                method: 'post'
            };
        return this.httpClient.post( post_url, data, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) );
    }
}
