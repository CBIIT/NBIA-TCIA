import { EventEmitter, Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )
export class WidgetSiteLicenseService{
    siteLicenseEmitter = new EventEmitter();
    siteLicenseSiteEmitter = new EventEmitter();
    siteLicense = '';
    siteLicenseSite = '';

    constructor(){
    }

    setSiteLicense( lic ){
        this.siteLicenseEmitter.emit( lic );
        this.siteLicense = lic;
    }

    setSiteLicenseSite( site ){
        this.siteLicenseSiteEmitter.emit( site );
        this.siteLicenseSite = site;
    }

    getSiteLicense(){
        return this.siteLicense;
    }

    getSiteLicenseSite(){
        return this.siteLicenseSite;
    }
}
