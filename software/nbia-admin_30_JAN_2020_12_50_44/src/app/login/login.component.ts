import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoginService } from './login.service';
import { takeUntil } from 'rxjs/operators';
import { Consts, TokenStatus } from '../constants';
import { AccessTokenService } from '../admin-common/services/access-token.service';
import { ParameterService } from '../admin-common/services/parameter.service';
import { UtilService } from '../admin-common/services/util.service';
import { ApiService } from '../admin-common/services/api.service';

@Component( {
    selector: 'nbia-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
} )
export class LoginComponent implements OnInit, OnDestroy{

    showLogin = false;
    loginType;
    handleMoving = false;

    username;
    password;
    statusMessage0 = '';

    consts = Consts;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private loginService: LoginService, private accessTokenService: AccessTokenService,
                 private parameterService: ParameterService, private utilService: UtilService,
                 private apiService: ApiService ) {
    }

    ngOnInit() {
        this.loginService.loginEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showLogin = true;
                // No token, expired token.  So we can display reason for login at the top of the login screen
                this.loginType = data;
            } );
    }

    async onSubmit() {
        this.accessTokenService.getAccessTokenFromServer( this.username, this.password );
        while( this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ){
            await this.utilService.sleep( Consts.waitTime );
        }

        // Test the new token
        this.accessTokenService.testToken();

        // Wait for the token to finish being tested.
        while( this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ){
            await this.utilService.sleep( Consts.waitTime );
        }

        if( this.accessTokenService.getAccessTokenStatus() === TokenStatus.GOOD_TOKEN ){
            // Update roles
            this.apiService.getRoles();
        }
    }

    onPasswordFocus() {
        if( this.statusMessage0.length > 0 ){
            this.statusMessage0 = '';
        }
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
