import { EventEmitter, Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )
export class LoginService{

    loginEmitter = new EventEmitter();

    constructor() {
    }

    /**
     *
     * @param loginType - Was it a bad/expired token, or no token.
     */
    doLogin( loginType ) {
        this.loginEmitter.emit( loginType );
    }

}
