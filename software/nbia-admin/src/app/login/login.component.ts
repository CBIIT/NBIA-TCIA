import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { LoginService } from './login.service';
import { takeUntil } from 'rxjs/operators';
import { Consts, TokenStatus } from '@app/constants';
import { AccessTokenService } from '../admin-common/services/access-token.service';
import { UtilService } from '../admin-common/services/util.service';
import { ApiService } from '../admin-common/services/api.service';
import { NgForm } from '@angular/forms';

@Component( {
    selector: 'nbia-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
} )
export class LoginComponent implements OnInit, OnDestroy{
    @ViewChild( 'f', { static: true } ) loginForm: NgForm;
    showLogin = false;
    loginType;
    handleMoving = false;

    username;
    password;
    statusMessage0 = '';

    consts = Consts;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private loginService: LoginService,
        private accessTokenService: AccessTokenService,
        private utilService: UtilService,
        private apiService: ApiService
    ) {
    }

    ngOnInit() {
        this.loginService.loginEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.showLogin = true;
                // No token, expired token.  So we can display reason for login at the top of the login screen
                this.loginType = data;
            } );
    }

    async onSubmit() {
         this.accessTokenService.getAccessTokenFromServer(
            this.loginForm.value.username,
            this.loginForm.value.password
        );

        while(
            this.accessTokenService.getAccessTokenStatus() ===
            TokenStatus.NO_TOKEN_YET
            ){
            await this.utilService.sleep( Consts.waitTime );
        }

        switch( this.accessTokenService.getAccessTokenStatus() ){
            case TokenStatus.BAD_TOKEN:
                console.error( 'BAD_TOKEN' );
                this.statusMessage0 = 'Bad Username/Password';

                break;
            case TokenStatus.EXP_TOKEN:
                console.error( 'EXP_TOKEN' );
                this.statusMessage0 = 'Expired access token';
                break;
            case TokenStatus.HAVE_TOKEN:
                // We don't use this here anymore.
                break;
            case TokenStatus.GOOD_TOKEN:
                // Update roles
                this.apiService.getRoles();
                break;
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
