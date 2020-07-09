import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CineModeService } from './cine-mode.service';
import { ApiService } from '@app/admin-common/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilService } from '@app/admin-common/services/util.service';
import { takeUntil, timeout } from 'rxjs/operators';
import { Properties } from '@assets/properties';
import { Consts } from '@app/constants';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';
import { QuerySectionService } from '@app/tools/query-section-module/services/query-section.service';

@Component( {
    selector: 'nbia-cine-mode',
    templateUrl: './cine-mode.component.html',
    styleUrls: ['./cine-mode.component.scss']
} )
export class CineModeComponent implements OnInit, OnDestroy{
    @Input() currentTool = '';
    dicomData = [];
    showDicomData = true;
    showQcHistory = false;
    showQcStatus = true; // This default was requested by Betty
    showSeriesData = true; // This default was requested by Betty
    showCineModeViewer = false;
    // currentImage is 1 rather than 0 for the benefit of the user who does not expect the first image to be zero.
    currentImage = 1;
    currentImageWiggleRoom = 1;


    images = [];
    loading = false;
    loadingX = true;
    first;
    last;
    getThumbnailErrorCount = 0;
    imageCount = 0;
    haveAllData = false;
    haveDicomData = false;

    handleMoving = false;
    showDicom = false;
    progress = 0;
    seriesData = {};
    collectionSite = '';
    /**
     * We will need this when asking for the next series in the Search results.
     */
    searchResultsIndex;

    qcStatusReportResults = [];
    consts = Consts;
    frameRate = 15;
    maxFps = Properties.MAX_VIDEO_FPS;
    playState;
    PLAY = 0;
    PLAY_BACK = 1;
    STOP = 2;

    sectionHeading = '';
    sectionHeadings = ['Change QC Status', 'Delete Series'];

    properties = Properties;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private cineModeService: CineModeService, private apiService: ApiService, private httpClient: HttpClient,
                 private sanitizer: DomSanitizer, private utilService: UtilService,
                 private accessTokenService: AccessTokenService, private querySectionService: QuerySectionService ) {

    }

    ngOnInit() {

        this.cineModeService.displayCineModeImagesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.collectionSite = data['collectionSite'];
                this.seriesData = data['series'];
                this.searchResultsIndex = data['searchResultsIndex']; // FIXMENOW  We will not be using this get rid of it here and at the source
                this.showCineModeViewer = true;
                if( this.currentTool === Consts.TOOL_PERFORM_QC ){
                    this.sectionHeading = this.sectionHeadings[0];
                }else if( this.currentTool === Consts.TOOL_APPROVE_DELETIONS ){
                    this.sectionHeading = this.sectionHeadings[1];
                }

                this.reset();
                this.getImages();
                this.apiService.doSubmit( Consts.GET_HISTORY_REPORT_TABLE, '&seriesId=' + this.seriesData['series'] );

            } );


        this.apiService.qcHistoryResultsTableEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.qcStatusReportResults = data;

                // Sort by Series Id then Time Stamp
                this.qcStatusReportResults.sort( ( row1, row2 ) =>
                    row1['series'] < row2['series'] ? 1 : row1['series'] > row2['series'] ? 1 : row1['timeStamp'] < row2['timeStamp'] ? -1 : 1 );
            } );


        // Receive DICOM data by image.
        this.cineModeService.getDicomTagsByImageEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( (data['id'] === 'imageID=' + this.images[this.currentImage - 1]['imagePkId']) ||
                    (data['id'] === 'imageID=' + this.images[this.currentImageWiggleRoom - 1]['imagePkId'])
                ){
                    this.dicomData = data['res'];
                    this.haveDicomData = true;
                }
            },
            err => {
                console.error( 'Error getting DICOM Data: ', err );
            }
        );

        this.querySectionService.updateCollectionEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.collectionSite = data;
            } );

    }

    /**
     * This is just a (bad) test of trying to open CineMode in its own window.
     */
    openWin() {
        let divText = document.getElementById( 'cineMode' ).outerHTML;
        let myWindow = window.open( '', '', 'width=700,height=200' );
        let doc = myWindow.document;
        doc.open();
        doc.write( divText );
        doc.close();
   }

    checkCurrentImageNumber() {
        this.currentImage = +this.currentImage;
        if( this.currentImage === null ){
            this.currentImage = 1;
        }
        this.updateDicom();
    }

    onOpenImageClick( image ) {
        if( this.last > 0 ){
            this.apiService.downLoadDicomImageFile( image.seriesInstanceUid, image.sopInstanceUid, image.studyInstanceUid );
        }
    }


    async onPlayClick() {
        this.playState = this.PLAY;

        while( (this.currentImage < this.imageCount) && (this.playState === this.PLAY) ){
            await this.utilService.sleep( 1000 / +this.frameRate );
            this.currentImage++;
        }
        this.playState = this.STOP;

        // Last image
        if( this.currentImage === this.imageCount ){
            this.updateDicom();
        }
    }

    async onPlayBackwardsClick() {
        this.playState = this.PLAY_BACK;

        while( (this.currentImage > 1) && (this.playState === this.PLAY_BACK) ){
            await this.utilService.sleep( 1000 / +this.frameRate );
            this.currentImage--;
        }
        this.playState = this.STOP;

        // First image
        if( this.currentImage === 1 ){
            this.updateDicom();
        }
    }

    onPause() {
        this.playState = this.STOP;
        this.currentImageWiggleRoom = this.currentImage;
        this.updateDicom();

    }

    onFirstFrameClick() {
        this.playState = this.STOP;
        this.setCurrentImage( 1 );
    }

    onPreviousFrameClick() {
        this.playState = this.STOP;
        this.decCurrentImage();
    }

    onNextFrameClick() {
        this.playState = this.STOP;
        this.incCurrentImage();
    }

    onLastFrameClick() {
        this.playState = this.STOP;
        this.setCurrentImage( this.imageCount );
    }

    decCurrentImage() {
        this.currentImage--;
        if( this.currentImage < 1 ){
            this.currentImage = 1;
        }
        this.updateDicom();
    }

    incCurrentImage() {
        this.currentImage++;
        if( this.currentImage > (this.imageCount) ){
            this.currentImage = (this.imageCount);
        }
        this.updateDicom();
    }

    setCurrentImage( i ) {
        this.currentImage = i;
        this.updateDicom();
    }


    updateDicom() {
        if( this.showDicomData ){
            if( this.images[this.currentImage - 1] !== undefined ){
                this.dicomData = [];

                // currentImage - 1  because currentImage starts at 1 not 0.
                let query = 'imageID=' + this.images[this.currentImage - 1]['imagePkId'];

                this.getDicomData( query ).subscribe(
                    data => {
                        this.dicomData = data;
                        this.haveDicomData = true;
                    }
                );
            }
        }
    }


    getDicomData( query ) {
        let getUrl = Properties.API_SERVER_URL + '/nbia-api/services/' + Consts.DICOM_TAGS_BY_IMAGE + '?' + query;

        if( Properties.DEBUG_CURL ){
            let curl = 'curl -H \'Authorization:Bearer  ' + this.accessTokenService.getAccessToken() + '\' -k \'' + getUrl + '\'';
            console.log( 'getDicomData: ' + curl );
        }


        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.accessTokenService.getAccessToken()
        } );

        let options = {
            headers: headers,
            method: 'get',
        };

        let results;
        try{
            results = this.httpClient.get( getUrl, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) );
            return results;
        }catch( e ){
            // TODO react to error.
            console.error( 'getDicomData Exception: ' + e );
        }
    }


    closeCineMode() {
        this.showCineModeViewer = false;
        this.cineModeService.closeCineMode();
        this.reset();
    }

    reset() {
        this.progress = 0;
        this.images = [];
        this.currentImage = 1;
        this.getThumbnailErrorCount = 0;
        this.imageCount = 0;
        this.haveAllData = false;
        this.loadingX = true;
        this.haveDicomData = false;
    }

    getImageDrillDownData(): Observable<any> {
        let query = 'list=' + this.seriesData['seriesPkId'];

        if( Properties.DEBUG_CURL ){
            let curl = ' curl -H \'Authorization:Bearer  ' + this.accessTokenService.getAccessToken() + '\' -k \'' + Properties.API_SERVER_URL + '/nbia-api/services/getImageDrillDown\' -d \'' + query + '\'';
            console.log( 'doPost: ', curl );
        }

        let imageDrillDownUrl = Properties.API_SERVER_URL + '/nbia-api/services/getImageDrillDown';
        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.accessTokenService.getAccessToken()
        } );

        let options = {
            headers: headers,
        };
        return this.httpClient.post( imageDrillDownUrl, query, options );
    }


    async getImages() {
        this.loading = true;
        this.images = [];
        this.imageCount = 0;

        let len = 99999999;
        this.getImageDrillDownData().subscribe(
            data => {
                this.imageCount = data.length;

                len = this.imageCount;
                this.first = 0;
                this.last = len - 1;
                let n = 0;
                for( let i = this.first; i <= this.last; i++ ){
                    this.getThumbnails( data[i]['seriesInstanceUid'], data[i]['sopInstanceUid'], this.accessTokenService.getAccessToken() ).subscribe(
                        thumbnailData => {
                            this.images.push(
                                {
                                    'thumbnailImage': this.sanitizer.bypassSecurityTrustUrl( window.URL.createObjectURL( thumbnailData ) ),
                                    // 'thumbnailImage': 'assets/images/image_not_found.png',
                                    'imagePkId': data[i]['imagePkId'],


                                    /*                                  We can add this data back in if we want to make the image clickable and do/launch things.*/
                                    'seriesInstanceUid': data[i]['seriesInstanceUid'],
                                    'sopInstanceUid': data[i]['sopInstanceUid'],
                                    'studyInstanceUid': data[i]['studyInstanceUid'],

                                    'seq': i
                                }
                            );
                            // If there is only one image, don't divide by zer0
                            if( this.last === 0 ){
                                this.progress = 100;
                            }else{
                                this.progress = Math.trunc( (+n / +this.last) * 100 );
                                n++;
                            }

                            // If there is just one image we need to get the DICOM now/here.
                            if( this.imageCount === 1 ){
                                this.updateDicom();
                            }
                        },

                        // If we could not get the thumbnail from the server,
                        // we still want to display the frame with the "View Image" button
                        // because the DICOM image may still there.
                        thumbnailError => {
                            console.error( 'Error thumbnailError: ', thumbnailError['statusText'] );

                            // We need this count when we are waiting for all the images (by count) to arrive before moving on
                            this.getThumbnailErrorCount++;
                            this.images.push(
                                {
                                    // 'thumbnailImage': this.sanitizer.bypassSecurityTrustUrl( window.URL.createObjectURL( thumbnailData ) ),
                                    'thumbnailImage': 'assets/images/image_not_found.png',
                                    'imagePkId': data[i]['imagePkId'],


                                    /*                                  We can add this data back in if we want to make the image clickable and do/launch things.*/
                                    'seriesInstanceUid': data[i]['seriesInstanceUid'],
                                    'sopInstanceUid': data[i]['sopInstanceUid'],
                                    'studyInstanceUid': data[i]['studyInstanceUid'],

                                    'seq': i
                                }
                            );
                            // If there is only one image, don't divide by zer0
                            this.progress = 100;

                            // If there is just one image we need to get the DICOM now/here.
                            this.updateDicom();
                        }
                    );
                }
                this.loading = false;
            },
            err => {
                this.loading = false;
            }
        );

        // Wait until we have all the images.
        // this.commonService.setHaveAllData( false );
        this.haveAllData = false;
        /*
        if( Properties.IMAGE_LOAD_MODE === Properties.LOAD_ALL ){
            while( (this.images.length + this.getThumbnailErrorCount) < len ){
                await this.utilService.sleep( Properties.WAIT_TIME );
            }
        }else
            */
        {
            while( this.loading || ((this.images.length + this.getThumbnailErrorCount) < (this.last - this.first)) ){
                // await this.utilService.sleep( Properties.WAIT_TIME );
                await this.utilService.sleep( Consts.waitTime );
            }
            this.loadingX = false;
        }

        // this.commonService.setHaveAllData( true );
        // Sort by seq here - need to sort, they may not have arrived from the server in the order they where requested.
        this.images.sort( ( row1, row2 ) => (row1.seq - row2.seq) );
        this.haveAllData = true;
        this.currentImage = 1;
        this.updateDicom();
    }


    getThumbnails( seriesUid, objectId, accessToken ): Observable<any> {
        let post_url = Properties.API_SERVER_URL + '/nbia-api/services/getThumbnail';
        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer  ' + this.accessTokenService.getAccessToken()
        } );

        let data = 'seriesUID=' + seriesUid + '&objectUID=' + objectId;

        if( Properties.DEBUG_CURL ){
            let curl = 'curl -H \'Authorization:Bearer ' + this.accessTokenService.getAccessToken() + '\' -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
            console.log( 'doGet: ' + curl );
        }

        let options =
            {
                headers: headers,
                method: 'post',
                responseType: 'blob' as 'blob'
            };
        return this.httpClient.post( post_url, data, options );
    }


    toggleDicomCheckbox() {
        if( this.showDicomData ){
            let query = 'imageID=' + this.images[this.currentImage - 1]['imagePkId'];
            this.updateDicom();
            /*
                        if( !this.haveDicomData ){
                            this.apiService.dataGet( Consts.DICOM_TAGS_BY_IMAGE, query );
                        }
            */
        }
    }

    onShowQcHistoryClick( s ) {
        this.showQcHistory = s;
    }

    onShowQcStatusClick( s ) {
        this.showQcStatus = s;
    }

    onShowSeriesDataClick( s ) {
        this.showSeriesData = s;
    }

    /////////////////////////
    onDragBegin( e ) {
        this.handleMoving = true;
    }

    onMoveEnd( e ) {
        this.handleMoving = false;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
