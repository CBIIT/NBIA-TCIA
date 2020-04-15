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

@Injectable( {
    providedIn: 'root'
} )
export class ParameterService implements OnDestroy{

    currentTool = Consts.TOOL_NONE;
    token;

    parameterValuesSet = false;
    currentToolEmitter = new EventEmitter();

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();


    constructor( private route: ActivatedRoute, private httpClient: HttpClient,
                 private utilService: UtilService, private loginService: LoginService,
                 private accessTokenService: AccessTokenService ) {


        // @FIXME This is a dev time temporary bypass of receiving a token from the calling site.
        if( Properties.DEV_MODE ){
            // this.getAccessToken( 'nbia_guest', 'test', Consts.API_CLIENT_SECRET_DEFAULT ).subscribe(
            // this.getAccessToken( 'mlerner', 'changeme', Consts.API_CLIENT_SECRET_DEFAULT ).subscribe(
            this.getAccessToken( Properties.DEV_USER, Properties.DEV_PASSWORD, Consts.API_CLIENT_SECRET_DEFAULT ).subscribe(
                data => {
                    this.token = data['access_token'];
                    this.accessTokenService.setAccessToken( this.token );
                    this.initUrlParameters();
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
        if( (!this.utilService.isNullOrUndefinedOrEmpty( this.route.snapshot.queryParams[Consts.URL_KEY_TOOL] )) && (<string>this.route.snapshot.queryParams[Consts.URL_KEY_TOOL]).length > 0 ){
            this.setCurrentTool( this.route.snapshot.queryParams[Consts.URL_KEY_TOOL] );  // Subject
        }else{
            this.setCurrentTool( Consts.TOOL_NONE);
        }

        // Get access token  @CHECKME  If'd around for DEV time  MHL
        if( !Properties.DEV_MODE ){
            this.token = this.route.snapshot.queryParams[Consts.URL_KEY_TOKEN];  // Access Token
            this.accessTokenService.setAccessToken( this.token );
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

    // This is for testing only, use  @CHECKME
    getAccessToken( user, password, secret ): Observable<any> {
        let post_url = Properties.API_SERVER_URL + '/' + Consts.API_ACCESS_TOKEN_URL;

        let headers = new HttpHeaders( { 'Content-Type': 'application/x-www-form-urlencoded' } );

        let data = 'username=' + user + '&password=' + password + '&client_id=nbiaRestAPIClient&client_secret=' + secret + '&grant_type=password';

        if( Properties.DEBUG_CURL ){
            let curl = 'curl  -v -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
            console.log( 'getAccessToken: ' + curl );
        }

        let options =
            {
                headers: headers,
                method: 'post'
            };
        return this.httpClient.post( post_url, data, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) );
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
