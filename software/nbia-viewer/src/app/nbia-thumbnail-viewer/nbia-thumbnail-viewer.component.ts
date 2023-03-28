import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Properties } from '../../assets/properties';
import { UtilService } from '../services/util.service';
import { ServerAccessService } from '../services/server-access.service';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs/internal/Subject';
import { CommonService } from '../services/common.service';
import { ConfigurationService } from '../services/configuration.service';
import {CookieService} from 'ngx-cookie-service';

@Component( {
  selector: 'nbia-thumbnail-viewer',
  templateUrl: './nbia-thumbnail-viewer.component.html',
  styleUrls: ['./nbia-thumbnail-viewer.component.scss']
} )

export class NbiaThumbnailViewerComponent implements OnInit, OnDestroy{

  // The images for the top right -/+ buttons. These change in response to the mouse and being disabled.
  zoomOutImgSrc: string = 'assets/images/zoom_out_dark.png';
  zoomInImgSrc: string = 'assets/images/zoom_in_dark.png';

  // The array of all the jpg images.
  // This may change, to handle a large number of images, we may go back to the server for each page.
  images = [];

  imagesPerPage: number;
  currentPage = 0;

  // The first image of the current page.
  firstImage = 0;

  // The number of images displayed in each row.
  columns = Properties.VIEWER_COLUMNS_DEFAULT;

  // Minimum width of a column in pixels.
  columnSize = 130;

  // For the over all left and right margins
  marginOffset = 14;

  // Absolute maximum number of images per row.
  // If this is greater than 12 things will break.  The container will need to be modified for greater than 12.
  columnLimit = 12;

  // The maximum number of columns based on the current window width.
  currentMaxColumns;

  // The most recent column count that the user requested.
  userRequestedColumnCount;

  haveError = false;
  errorMessage0 = '';
  errorMessage1 = '';
  errorMessage2 = '';

  haveData = false;

  // For HTML access
  properties = Properties;

  // Used when retrieving the DICOM image
  currentViewImageIndex = -1;

  // Used to display the Series Description at the top of the display.
  description = '';

  mouseOver;

  // Used when determining how many images can fit in one row
  innerWidth;

  // Used when determining the height of the image grid, so it fits correctly between the hearing and footer.
  innerHeight;

  // Just for testing
  temp = 'Dog';

  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor( private cookieService: CookieService, private utilService: UtilService,
               private route: ActivatedRoute, private serverAccessService: ServerAccessService,
               private titleService: Title, public commonService: CommonService,
               private configurationService: ConfigurationService) {

    this.titleService.setTitle( Properties.TITLE );

    // This will set: DEFAULT_USER, DEFAULT_PASSWORD and DEFAULT_SECRET.
    // These will only be used if the we have been called from nbia-search, the user is the guest, and the access token has expired.
    this.configurationService.initConfiguration();

    // Get persisted user preference for viewer columns.
    this.columns = this.commonService.getPersistedValue( 'viewerColumns' );

    // If there is no persisted user preference for viewer columns, use the default
    if( this.utilService.isNullOrUndefined( this.columns ) ){
      this.columns = Properties.VIEWER_COLUMNS_DEFAULT;
      this.commonService.setPersistedValue( 'viewerColumns', this.columns );
    }
    this.userRequestedColumnCount = this.columns;

  }

  ngOnInit() {
    // Get description passed in the URL
    this.description = this.route.snapshot.queryParams['thumbnailDescription'];

    // To determining the maximum number of images that can fit in one row
    this.innerWidth = window.innerWidth;

    // For determining the height of the image grid, so it fits correctly between the heading and footer.
    this.innerHeight = (window.innerHeight - (50 + 50)).toString() + 'px';  // FIXME - make these constants

    if( this.columns > this.getMaxColumns( window.innerWidth ) ){
      this.columns = this.getMaxColumns( window.innerWidth );
    }
    this.currentMaxColumns = this.getMaxColumns( this.innerWidth );

    // If no description was provided in the url, make sure the description is empty.
    if( this.utilService.isNullOrUndefinedOrEmpty( this.description ) || (this.description === 'null') ){
      this.description = '';
    }

    // When the page changes.
    this.commonService.currentPageEmitter.subscribe(
      data => {
        this.currentPage = data;
        this.updatePage();
      }
    );

    // When the number of images per page changes.
    this.commonService.imagesPerPageEmitter.subscribe(
      data => {
        this.imagesPerPage = data;
        this.updatePage();
      },
      err => {
        console.error( 'imagesPerPageEmitter imagesPerPage ERROR: ', err );
      }
    );

    // Receives the jpg image array.
    this.serverAccessService.getImagesResultsEmitter.subscribe(
      data => {
        this.images = data;
        this.mouseOver = new Array<number>( this.images.length );
      },
      err => {
        this.reactToError( 'Failed to get Images', err['status'].toString(), err['statusText'] );
      }
    );


    // //////////////////////////////////////////////////////////////
    // Error emitter subscribes
    //
    // Will likely get one of two errors:
    //   Authorization 401 - expired token
    //   Internal Server error 500 - Could be missing jpg.
    //       we may change return code for missing jpg from 500 on the server side.

    // Calling serverAccessService.getImages can possibly trigger either of two error emitters.
    //  getThumbnailsEmitter
    //  getImageDrillDownDataErrorEmitter

    // 401 - expired token
    // 500 - Could be missing jpg, we may change return code from 500 to something else from the server side.


    // This getThumbnails called after getImageDrillDownData, so we are not likely to get a 401,
    // we would have got the 401 earlier in getImageDrillDownData.
    // If we do get an error here, it is likely a 500 Server error because the thumbnail image was missing on the server,
    // this will be handled by serverAccessService.getImages
    this.serverAccessService.getThumbnailsEmitter.subscribe(
      data => {
        if( data.status !== 500 ){
          console.error( 'Error getThumbnails: ', data['statusText'] );
        }
      }
    );


    // This is our first server call, if there is going to be an Authorization error (401) it will happen here or in getDicomImageErrorEmitter.
    this.serverAccessService.getImageDrillDownDataErrorEmitter.subscribe(
      async data => {
        let currentError = {};

        // Authorization - bad access token error
        if( data.status === 401 ){
          // User is guest try to get a new token
          if( this.isGuest() ){
            let token;
            this.serverAccessService.getNewGuestServerAccessToken().subscribe(
              tokenData => {
                token = tokenData['access_token'];
                this.setNewToken( token );

                // We have a new token, try getImages again.
                // FIXME If there is a 401 error with a new token, we will loop endlessly!
                this.serverAccessService.getImages( );
              },
              err => {
                currentError = err;
                token = null;
              }
            );

            while( token === undefined ){
              await this.utilService.sleep( 50 );
            }
            if( token === null ){
              this.reactToError( 'Guest Authentication retry failed', currentError['status'].toString(), currentError['statusText'] );
            }
          }  // End isGuest
          else{
            this.reactToError( 'Expired login', data['status'].toString(), data['statusText'] );
          }
        } // End of 401

        // An error that is NOT 401
        else{
          this.reactToError( 'Failed to get thumbnail images', data['status'].toString(), data['statusText'] );
        }
      }
    );


    // When this.onOpenImageClick calls serverAccessService.downLoadDicomImageFile,
    this.serverAccessService.getDicomImageErrorEmitter.subscribe(
      async data => {
        let currentError = {};

        // Authorization - bad access token error
        if( data.status === 401 ){
          // User is guest try to get a new token
          if( this.isGuest() ){
            let token;
            this.serverAccessService.getNewGuestServerAccessToken().subscribe(
              tokenData => {
                token = tokenData['access_token'];
                this.setNewToken( token );

                // We have a new token, try getImages again.
                // FIXME If there is a 401 error with a new token, we will loop endlessly!
                this.onOpenImageClick( this.currentViewImageIndex );
              },
              err => {
                currentError = err;
                token = null;
              }
            );
            while( token === undefined ){
              await this.utilService.sleep( 50 );
            }
            if( token === null ){
              this.reactToError( 'getDicomImage Guest Authentication retry failed', currentError['status'].toString(), currentError['statusText'] );
            }
          }  // End isGuest
          else{
            this.reactToError( 'getDicomImage Expired login', data['status'].toString(), data['statusText'] );
          }
        } // End of 401
        else{
          this.reactToError( 'Failed to get Dicom Images', data['status'].toString(), data['statusText'] );
        }
      }
    );

    this.commonService.haveAllDataEmitter.subscribe(
      data => {
        this.haveData = data;
      }
    );

    if( Properties.IMAGE_LOAD_MODE === Properties.LOAD_ALL ){
      this.serverAccessService.getImages();
    }

  } // End ngOnInit


  @HostListener( 'window:resize', ['$event'] )
  onResize( event ) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = (window.innerHeight - (50 + 50)).toString() + 'px'; // FIXME
    this.currentMaxColumns = this.getMaxColumns( this.innerWidth );

    if( this.columns > this.currentMaxColumns ){
      this.columns = this.currentMaxColumns;
    }

    if( (this.columns < this.currentMaxColumns) && (this.columns < this.userRequestedColumnCount) ){
      this.columns++;
    }
  }


  onRadioClick( i ){
    Properties.IMAGE_LOAD_MODE = i;
  }

  getMaxColumns( winWidth ) {
    let res = Math.ceil( ((winWidth - this.marginOffset) / this.columnSize) - 1 );
    if( res > this.columnLimit ){
      res = this.columnLimit;
    }
    return res;
  }

  onMinusClick() {
    if( this.columns < this.getMaxColumns( this.innerWidth ) ){
      this.columns++;
      this.userRequestedColumnCount = this.columns;
      this.commonService.setPersistedValue( 'viewerColumns', this.columns );

    }
    if( this.columns >= this.getMaxColumns( this.innerWidth ) ){
      this.onZoomOutMouseOver();
    }
  }

  onPlusClick() {
    if( this.columns > 1 ){
      this.columns--;
      this.userRequestedColumnCount = this.columns;
      this.commonService.setPersistedValue( 'viewerColumns', this.columns );
    }
    if( this.columns <= 1 ){
      this.onZoomInMouseOver();
    }
  }


  updatePage() {
    if( Properties.IMAGE_LOAD_MODE ===  Properties.LOAD_ALL ){
      this.firstImage = this.currentPage * this.imagesPerPage;
    }else{
      this.firstImage = 0;
    }
  }


  reactToError( whatFailed, errorNum, errorText ) {
    console.error( 'Error( ' + whatFailed + ', ' + errorNum + ', ' + errorText + ')' );
    this.haveError = true;
    this.errorMessage0 = whatFailed;
    // this.errorMessage1 = errorNum;
    this.errorMessage2 = errorText;
  }

  getToken() {
    return this.commonService.getPersistedValue( 'at' );
  }

  setNewToken( token ) {
    this.commonService.setPersistedValue( 'at', token );
    this.serverAccessService.setToken( token);
  }


  isGuest() {
    let g = this.commonService.getPersistedValue( 'guest' );
    if( this.utilService.isNullOrUndefined( g ) ){
      return true;
    }

    return this.utilService.isTrue( g );
  }

  onOpenImageClick( i ) {
    // We keep this value in case the call to get the image fails due to error 401, and the user is guest,
    // we can get a new token and try again.
    this.currentViewImageIndex = i;
    this.serverAccessService.downLoadDicomImageFile( this.images[i].seriesInstanceUid, this.images[i].sopInstanceUid, this.images[i].studyInstanceUid );
  }

  onMouseOver( i ) {
    this.mouseOver[i] = true;
  }

  onMouseOut( i ) {
    this.mouseOver[i] = false;
  }

  onZoomOutMouseOver(): void {
    if( this.columns >= this.currentMaxColumns ){
      this.zoomOutImgSrc = 'assets/images/zoom_out_dark.png';
    }else{
      this.zoomOutImgSrc = 'assets/images/zoom_out_white.png';
    }
  }

  onZoomOutMouseOut(): void {
    this.zoomOutImgSrc = 'assets/images/zoom_out_dark.png';
  }

  onZoomInMouseOver(): void {
    if( this.columns > 1 ){
      this.zoomInImgSrc = 'assets/images/zoom_in_white.png';
    }
    else{
      this.zoomInImgSrc = 'assets/images/zoom_in_dark.png';
    }
  }

  onZoomInMouseOut(): void {
    this.zoomInImgSrc = 'assets/images/zoom_in_dark.png';
  }


  ngOnDestroy(): void {
  }

}
