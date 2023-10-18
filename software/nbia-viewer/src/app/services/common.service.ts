import { EventEmitter, Injectable } from '@angular/core';
import { Properties } from '../../assets/properties';
import { CookieService } from 'ngx-cookie-service';
import { UtilService } from './util.service';

@Injectable( {
    providedIn: 'root'
} )
export class CommonService{

    // save and restore the column count & images per page.
    cookieData;


    imagesPerPageEmitter = new EventEmitter();
    imagesPerPage = Properties.IMAGES_PER_PAGE_CHOICE_DEFAULT;
    currentPageEmitter = new EventEmitter();
    currentPage = 0;
    imageCountEmitter = new EventEmitter();
    imageCount = 0;

    haveAllDataEmitter = new EventEmitter();
    haveAllData = false;

    constructor( private cookieService: CookieService, private utilService: UtilService ) {
        if(this.cookieService.get( Properties.COOKIE_NAME ) == null || this.cookieService.get( Properties.COOKIE_NAME ) == ""){
            this.cookieData = {};
        } else {
            this.cookieData = JSON.parse( this.cookieService.get( Properties.COOKIE_NAME ) );
        }
    }

    setHaveAllData( haveIt ) {
        this.haveAllData = haveIt;
        this.haveAllDataEmitter.emit( haveIt );
    }

    getHaveAllData( haveIt ) {
        return this.haveAllData;
    }


    setImagesPerPage( i ) {
        this.imagesPerPageEmitter.emit( i );
        this.setPersistedValue( 'imagesPerPage', i );
        this.imagesPerPage = i;
    }

    getImagesPerPage() {
        return this.imagesPerPage;
    }

    setCurrentPage( p ) {
        this.currentPageEmitter.emit( p );
        this.currentPage = p;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    setImageCount( c ) {
        this.imageCountEmitter.emit( c );
        this.imageCount = c;
    }

    getImageCount() {
        return this.imageCount;
    }

    getPersistedValue( key ) {
        // todo: clean this up
        // temporary fix for retreiving access token from local storage rather than cookie
        if(key == 'at'){
            return localStorage.getItem('at');
        }
        if( !this.utilService.isNullOrUndefinedOrEmpty( this.cookieData ) ){
            try{
                return this.cookieData[key];
            }
            catch( e ){
                console.error( 'Error parsing persisted data: ', e.message );
                return '';
            }
        }
    }

    setPersistedValue( key, value ) {
        this.cookieData[key] = value;
        this.cookieService.set( Properties.COOKIE_NAME, JSON.stringify( this.cookieData ) );
    }


}
