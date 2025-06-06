import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '@app/admin-common/services/common.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { Properties } from '@assets/properties';
import { Consts } from '@app/constants';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { ConfigurationService } from '@app/admin-common/services/configuration.service';


@Injectable( {
    providedIn: 'root'
} )

/**
 * Sets brand related Properties.
 *
 * Branding data is in assets/brand
 * Each "brand" is in its own directory within assets/brand
 * Which brand to use is stored in the text file assets/brand/currentBrand
 *     This file should contain the name of the brand (directory) to use.
 *     If this file is missing, or the matching brand directory is missing, the default brand "nbia" will be used.
 *
 * Each brand directory can contain the following (if any file is not provided, the file from the (default) nbia brand will be used.
 *     logo.png - The graphic in the top left corner, it should be 41 pixels high.
 *     customMenu.json - This is the data for the top menu right below the top left corner graphic.
 *                       It is a fairly simple JSON object, use assets/brand/nbia/customMenu.json as a guide.
 *     accountHelpUrl.txt - The url launched when the "Account help" in the login screen is clicked.
 *     newAccountUrl.txt - The url launched when the "New account" in the login screen is clicked.
 *     footer.html - The footer that is always at the bottom of the page.
 */
export class BrandingService{

    OTHER = 0;
    CUSTOM_MENU_DATA = 1;
    ACCOUNT_HELP = 2;
    NEW_ACCOUNT_REGISTRATION = 4;
    FOOTER_HTML = 5;
    TEXT_SEARCH_DOCUMENTATION = 6;
    VERSION_SUFFIX = 7;
    DOWNLOADER_URL = 8;
    currentDate = new Date();

    constructor( private httpClient: HttpClient, private commonService: CommonService,
                 private utilService: UtilService, private configurationService: ConfigurationService ) {
    }


    /**
     * currentBrand file is a text file with the brand "name", this is the directory name within the assets/brand directory for this brand.
     */
    async initCurrentBrand() {
        // Check for config file which will take precedence
        let runaway = 100; // Just in case.
        while( (!Properties.CONFIG_COMPLETE) && (runaway > 0) ){
            await this.utilService.sleep( Consts.waitTime );  // Wait 50ms
            runaway--;
        }
        if( this.utilService.isNullOrUndefinedOrEmpty( Properties.BRAND ) || (Properties.BRAND === '%BRAND%') ){
            this.readTextFile( 'assets/' + Properties.BRAND_DIR + '/currentBrand' ).subscribe(
                data => {

                    Properties.BRAND = data.trim();
                    this.initBrandSettings();

                },
                err => {

                    if( err.status === 404 ){
                        console.error( 'Could not find Brand file "' + 'assets/' + Properties.BRAND_DIR + '/currentBrand' + '", setting Brand to default "' + Properties.DEFAULT_BRAND + '"' );
                        Properties.BRAND = Properties.DEFAULT_BRAND;
                        this.initBrandSettings();

                    }
                    console.error( 'Could not access Brand file! ', err.status );
                }
            );
        }else{
            this.initBrandSettings();
        }
    }

    async initBrandSettings() {
        this.initLogo();
        this.initBrandItem( this.CUSTOM_MENU_DATA, '/customMenu.json' );
        this.initBrandItem( this.DOWNLOADER_URL, '/downloaderUrl.txt' );
        this.initBrandItem( this.ACCOUNT_HELP, '/accountHelpUrl.txt' );
        this.initBrandItem( this.NEW_ACCOUNT_REGISTRATION, '/newAccountUrl.txt' );
        this.initBrandItem( this.TEXT_SEARCH_DOCUMENTATION, '/textSearchDocumentationUrl.txt' );
        this.initBrandItem( this.VERSION_SUFFIX, '/versionSuffix.txt' );

        // MAKE SURE FOOTER_HTML COMES AFTER VERSION_SUFFIX!!!  FOOTER_HTML uses VERSION_SUFFIX!!!
        let runaway = 100; // Just in case.
        while( (Properties.VERSION_SUFFIX === 'PLACE_HOLDER') && (runaway > 0) ){
            await this.utilService.sleep( Consts.waitTime );  // Wait 50ms
            runaway--;
        }
        this.initBrandItem( this.FOOTER_HTML, '/footer.html' );

    }


    initValue( file, item = this.OTHER ) {
        if( item === this.CUSTOM_MENU_DATA ){
            return this.getJSON( 'assets/' + Properties.BRAND_DIR + '/' + file );
        }else{
            return this.readTextFile( 'assets/' + Properties.BRAND_DIR + '/' + file );
        }
    }


    // TODO this has some copy/paste things from nbia-search
    setBrandItem( item, value ) {
        switch( item ){
            case this.CUSTOM_MENU_DATA:
                Properties.CUSTOM_MENU_DATA = value;
                break;
            case this.ACCOUNT_HELP:
                Properties.ACCOUNT_HELP = value;
                break;
            case this.NEW_ACCOUNT_REGISTRATION:
                Properties.NEW_ACCOUNT_REGISTRATION = value;
                break;
            case this.TEXT_SEARCH_DOCUMENTATION:
                Properties.TEXT_SEARCH_DOCUMENTATION = value;
                break;
            case this.DOWNLOADER_URL:
                Properties.DOWNLOADER_URL = value;
                break;
            case this.VERSION_SUFFIX:
                Properties.VERSION_SUFFIX = value;
                break;
            case this.FOOTER_HTML:
                Properties.FOOTER_HTML = value.trim().replace( /%VERSION%/g, this.configurationService.getSharedConfig('version') )
                .replace( /%TEST_VERSION%/g, this.configurationService.getSharedConfig('testVersion') )
                .replace( /%HOST_NAME%/g, Properties.HOST_NAME )
                .replace( /%CURRENT_YEAR%/g, this.configurationService.getSharedConfig('currentYear') )
                .replace(/%RELEASE_COMMIT%/g, this.configurationService.getSharedConfig('releaseCommit') );
               
                break;
        }
    }

    getTimeStamp() {
        return (this.currentDate.getMonth() + 1) + '/' +
            this.currentDate.getDate() + '/' +
            this.currentDate.getFullYear() + '  ' +
            this.utilService.leftPad( this.currentDate.getHours(), 2 ) + ':' +
            this.utilService.leftPad( this.currentDate.getMinutes() );
    }

    initBrandItem( item, file ) {
        this.initValue( Properties.BRAND + file, item ).subscribe(
            data0 => {
                this.setBrandItem( item, data0 );
            },
            err0 => {

                // If the file is not there, we will try to find it in default brand directory
                if( err0.status === 404 ){
                    console.log( 'Could not find ' + Properties.BRAND + file + '  will try default.' );
                    this.initValue( Properties.DEFAULT_BRAND + file, item ).subscribe(
                        data1 => {
                            this.setBrandItem( item, data1 );
                        },
                        err1 => {
                            console.error( 'Could not ' + ((err1.status === 404) ? 'find ' : 'access ') + Properties.BRAND + file + ' or ' + Properties.DEFAULT_BRAND + file );
                        }
                    );
                }else{
                    console.error( 'Error initBrandItem: ', err0 );
                }
            }
        );

    }


    initLogo() {

        this.readTextFile( 'assets/' + Properties.BRAND_DIR + '/' + Properties.BRAND + '/logo.png' ).subscribe(
            () => {
                Properties.LOGO_FILE = 'assets/' + Properties.BRAND_DIR + '/' + Properties.BRAND + '/logo.png';
            },
            err => {
                if( err.status === 404 ){
                    console.log( 'Could not find ' + Properties.BRAND + '/logo.png' + '  will try default.' );
                    Properties.LOGO_FILE = 'assets/' + Properties.BRAND_DIR + '/' + Properties.DEFAULT_BRAND + '/logo.png';
                }
                console.error( 'Could not ' + ((err.status === 404) ? 'find ' : 'access ') + Properties.BRAND + '/logo.png or ' + Properties.DEFAULT_BRAND + '/logo.png' );
            }
        );
    }


    readTextFile( file )
        :
        Observable<any> {
        return this.httpClient.get( file,
            {
                responseType: 'text'
            } ).pipe( timeout( Properties.HTTP_TIMEOUT ) );
    }

    getJSON( file )
        :
        Observable<any> {
        return this.httpClient.get( file );
    }

}
