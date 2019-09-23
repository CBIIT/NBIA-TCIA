import { Component, OnInit } from '@angular/core';
import { Properties } from '@assets/properties';
import { sha224 } from 'js-sha256';
import { CookieOptionsArgs, CookieService } from 'angular2-cookie/core';
import { UtilService } from '@app/common/services/util.service';

@Component( {
    selector: 'nbia-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss']
} )
export class BannerComponent implements OnInit{
    cookieName = 'nbiaMess';
    bannerText = Properties.BANNER_TEXT_NBIA_;
    expiresTimestamp: Date = new Date( Properties.BANNER_EXP_NBIA_ );
    now: Date = new Date();
    bannerExp = Properties.BANNER_EXP_NBIA_;
    hash = sha224( Properties.BANNER_TEXT_NBIA_ + ':' + Properties.BANNER_EXP_NBIA_ );

    showBanner;

    constructor( private cookieService: CookieService, private utilService: UtilService ) {

    }

    ngOnInit() {
        this.showBanner = false;
        if(
            (! this.utilService.isNullOrUndefinedOrEmpty( Properties.BANNER_TEXT_NBIA_)) &&
            (! this.utilService.isNullOrUndefinedOrEmpty( Properties.BANNER_EXP_NBIA_)) &&
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
