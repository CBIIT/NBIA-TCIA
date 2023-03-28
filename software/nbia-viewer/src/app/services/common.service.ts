import { EventEmitter, Injectable } from '@angular/core';
import { Properties } from '../../assets/properties';
import {CookieService} from 'ngx-cookie-service';
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
    //this.cookieData = JSON.parse( this.cookieService.get( Properties.COOKIE_NAME ) );
    // let cookieDataTemp = '{"lastAccess":{"date":{"day":8,"month":3,"year":2023}},"showIntro":false,"cartSortState":"[0,0,1,0,0,0,0,0,0,0]","queryTypeTab":0,"criteriaQueryShow":"{\\"showQueryAvailable\\":false,\\"showQuerySubjectIds\\":false,\\"showQueryPhantoms\\":false,\\"showQueryThirdParty\\":false,\\"showQueryImageModality\\":true,\\"showQueryCollections\\":true,\\"showQueryAnatomicalSite\\":true,\\"showQuerySpecies\\":true}","searchResultSortState":"[0,0,1,0,0,0,0,0,0,0]","search_results_rows_PerPage":10,"carts_PerPage":10,"dataDisplayTab":1,"guest":true,"at":"efbd4c3c-7391-4982-b5bd-389ca979569c","rt":"fb673c7d-be75-4ca9-ac74-7a6efd57062f","atlp":3844,"userName":"mlerner"}';
     let cookieDataTemp = '{"lastAccess":{"date":{"day":8,"month":3,"year":2023}},"showIntro":false,"cartSortState":"[0,0,1,0,0,0,0,0,0,0]","queryTypeTab":0,"criteriaQueryShow":"{\\\"showQueryAvailable\\\":false,\\\"showQuerySubjectIds\\\":false,\\\"showQueryPhantoms\\\":false,\\\"showQueryThirdParty\\\":false,\\\"showQueryImageModality\\\":true,\\\"showQueryCollections\\\":true,\\\"showQueryAnatomicalSite\\\":true,\\\"showQuerySpecies\\\":true}","searchResultSortState":"[0,0,1,0,0,0,0,0,0,0]","search_results_rows_PerPage":10,"carts_PerPage":10,"dataDisplayTab":1,"guest":true,"at":"efbd4c3c-7391-4982-b5bd-389ca979569c","rt":"fb673c7d-be75-4ca9-ac74-7a6efd57062f","atlp":3844,"userName":"mlerner"}';
    // let cookieDataTemp = '{"lastAccess":{"date":{"day":8,"month":3,"year":2023}},"showIntro":false,"cartSortState":"[0,0,1,0,0,0,0,0,0,0]","queryTypeTab":0,"criteriaQueryShow":"{\"showQueryAvailable\":false,\"showQuerySubjectIds\":false,\"showQueryPhantoms\":false,\"showQueryThirdParty\":false,\"showQueryImageModality\":true,\"showQueryCollections\":true,\"showQueryAnatomicalSite\":true,\"showQuerySpecies\":true}","searchResultSortState":"[0,0,1,0,0,0,0,0,0,0]","search_results_rows_PerPage":10,"carts_PerPage":10,"dataDisplayTab":1,"guest":true,"at":"efbd4c3c-7391-4982-b5bd-389ca979569c","rt":"fb673c7d-be75-4ca9-ac74-7a6efd57062f","atlp":3844,"userName":"mlerner"}';
    try {
      this.cookieData = JSON.parse(cookieDataTemp);
    } catch (e) {
      console.log('Error: ' + e);
    }
    this.cookieService.set( Properties.COOKIE_NAME, cookieDataTemp  );

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
