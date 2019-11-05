import { Component, OnInit } from '@angular/core';
import { Properties } from '@assets/properties';
import { sha224 } from 'js-sha256';
import { CookieOptionsArgs, CookieService } from 'angular2-cookie/core';
import { UtilService } from '@app/common/services/util.service';
import { ConfigurationService } from '@app/common/services/configuration.service';
import { Consts } from '@app/consts';
import { CommonService } from '@app/image-search/services/common.service';

@Component( {
    selector: 'nbia-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss']
} )
export class BannerComponent implements OnInit{
    cookieName = 'nbiaMess';
    expiresTimestamp: Date = new Date( Properties.BANNER_EXP );
    now: Date = new Date();
    bannerExp = Properties.BANNER_EXP;
    hash;

    showBanner;
    properties = Properties;

    constructor( private cookieService: CookieService, private utilService: UtilService,
                 private configurationService: ConfigurationService, private commonService: CommonService ) {
    }

    async ngOnInit() {
        this.showBanner = false;
        let runaway = 100; // Just in case.
        while( (!Properties.CONFIG_COMPLETE) && (runaway > 0) ){
            await this.commonService.sleep( Consts.waitTime );  // Wait 50ms
            runaway--;
        }
        this.hash = sha224( Properties.BANNER_TEXT + ':' + Properties.BANNER_EXP );

        if(
            (!this.utilService.isNullOrUndefinedOrEmpty( Properties.BANNER_TEXT )) &&
            (!this.utilService.isNullOrUndefinedOrEmpty( Properties.BANNER_EXP )) &&
            (this.expiresTimestamp > this.now)
        ){
            this.checkForCookie();
        }
    }


    onCloseBanner() {
        this.showBanner = false;
        this.writeCookie();
    }

    checkForCookie() {
        let cookieData = this.cookieService.get( this.cookieName );
        if( this.utilService.isNullOrUndefined( cookieData ) || (this.hash !== cookieData) ){
            this.showBanner = true;
        }
    }

    // Tell a browser cookie we have seen this with an expiration date
    writeCookie() {
        let options: CookieOptionsArgs = <CookieOptionsArgs>{
            expires: this.expiresTimestamp
        };
        this.cookieService.put( this.cookieName, this.hash, options );
    }

}
