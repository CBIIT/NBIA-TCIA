import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CineModeService } from '@app/cine-mode/cine-mode.service';
import { Properties } from '@assets/properties';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Consts } from '@app/consts';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '@app/image-search/services/common.service';
import { UtilService } from '@app/common/services/util.service';

@Component( {
    selector: 'nbia-cine-mode',
    templateUrl: './cine-mode.component.html',
    styleUrls: ['./cine-mode.component.scss']
} )
export class CineModeComponent implements OnInit, OnDestroy{
    dicomData = [];
    showDicomData = true;
    showCineModeViewer = false;
    // currentImage is 1 rather than 0 for the benefit of the user who does not expect the first image to be zero.
    currentImage = 1;
    currentImageWiggleRoom = 1;

    displayCineModeImagesEmitter = new EventEmitter();
    seriesId;
    seriesUID;
    seriesDescription;
    studyDate;

    images;
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

    frameRate = 15;
    playState;
    PLAY = 0;
    PLAY_BACK = 1;
    STOP = 2;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private cineModeService: CineModeService, private apiServerService: ApiServerService, private httpClient: HttpClient,
                 private sanitizer: DomSanitizer, private commonService: CommonService, private utilService: UtilService ) {
    }

    ngOnInit() {

        this.cineModeService.displayCineModeImagesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.reset();
                this.showCineModeViewer = true;
            } );

        // From cine-mode.service
        this.cineModeService.sendCineModeDataEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.dicomData = <any>data['dicomData'];
                this.seriesUID = data['seriesUID'];
                this.seriesId = data['seriesId'];
                this.seriesDescription = data['seriesDescription'];
                this.studyDate = data['studyDate'];
                this.getImages();

                // This gets the DICOM data by series which returns the DICOM data for the first image.
                // We don't get it by image number, like we do elsewhere because we may not have the images yet.
                if( (!this.haveDicomData) && this.showDicomData ){
                    let query = 'SeriesUID=' + this.seriesUID;
                    this.apiServerService.dataGet( Consts.DICOM_TAGS, query );
                }
            } );


        // Receive DICOM data by image.
        this.apiServerService.getDicomTagsByImageEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( (data['id'] === 'imageID=' + this.images[this.currentImage - 1]['imagePkId']) ||
                    (data['id'] === 'imageID=' + this.images[this.currentImageWiggleRoom - 1]['imagePkId'])
                ){
                    this.dicomData = <any>data['res'];
                    this.haveDicomData = true;
                }
            },
            err => {
                console.error( 'Error getting DICOM Data: ', err );
            }
        );

    }

    checkCurrentImageNumber() {
        this.currentImage = +this.currentImage;
        if( this.currentImage === null ){
            this.currentImage = 1;
        }
        this.updateDicom();
    }


    async onPlayClick() {
        this.playState = this.PLAY;

        while( (this.currentImage < this.imageCount) && (this.playState === this.PLAY) ){
            await this.commonService.sleep( 1000 / +this.frameRate );
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
            await this.commonService.sleep( 1000 / +this.frameRate );
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
            this.dicomData = [];
            // currentImage - 1  because currentImage starts at 1 not 0.
            let query = 'imageID=' + this.images[this.currentImage - 1]['imagePkId'];
            this.apiServerService.dataGet( Consts.DICOM_TAGS_BY_IMAGE, query );
        }

    }

    closeCineMode() {
        this.showCineModeViewer = false;
        this.reset();
    }

    reset() {
        this.progress = 0;
        this.seriesDescription = '';
        this.images = [];
        this.currentImage = 1;
        this.getThumbnailErrorCount = 0;
        this.imageCount = 0;
        this.haveAllData = false;
        this.loadingX = true;
        this.haveDicomData = false;

    }

    getImageDrillDownData(): Observable<any> {
        let query = 'list=' + this.seriesId;

        // if( Properties.DEBUG_CURL ){
        let curl = ' curl -H \'Authorization:Bearer  ' + this.apiServerService.showToken() + '\' -k \'' + Properties.API_SERVER_URL + '/nbia-api/services/getImageDrillDown\' -d \'' + query + '\'';
        console.log( 'doPost: ', curl );
        // }

        let imageDrillDownUrl = Properties.API_SERVER_URL + '/nbia-api/services/getImageDrillDown';
        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.apiServerService.showToken()
        } );

        let options = {
            headers: headers,
        };
        return this.httpClient.post( imageDrillDownUrl, query, options );
    }

    /**
     * If page has a value, only that page of images is downloaded.
     * If page & imageNumber have value, get just one image.
     *
     * We get the current number of images per page from commonService.getImagesPerPage().

     * @param page
     * @param imageNumber
     */
    async getImages( page?, imageNumber? ) {
        this.loading = true;
        this.images = [];
        let len = 99999999;
        this.getImageDrillDownData().subscribe(
            data => {
                this.imageCount = data.length;
                len = this.imageCount;

                this.first = 0;
                this.last = len - 1;
                let n = 0;
                for( let i = this.first; i <= this.last; i++ ){

                    this.getThumbnails( data[i]['seriesInstanceUid'], data[i]['sopInstanceUid'], this.apiServerService.showToken() ).subscribe(
                        thumbnailData => {
                            this.images.push(
                                {
                                    'thumbnailImage': this.sanitizer.bypassSecurityTrustUrl( window.URL.createObjectURL( thumbnailData ) ),
                                    'imagePkId': data[i]['imagePkId'],


                                    /*                                  We can add this data back in if we want to make the image clickable and do/launch things.
                                                                        'seriesInstanceUid': data[i]['seriesInstanceUid'],
                                                                        'sopInstanceUid': data[i]['sopInstanceUid'],
                                                                        'studyInstanceUid': data[i]['studyInstanceUid'],
                                    */
                                    'seq': i
                                }
                            );
                            this.progress = Math.trunc( (+n / +this.last) * 100 );
                            n++;
                        },

                        // If we could not get the thumbnail from the server,
                        // we still want to display the frame with the "View Image" button
                        // because the DICOM image may still there.
                        thumbnailError => {
                            console.log( 'ThumbnailError: ', thumbnailError );
                            // We need this count when we are waiting for all the images (by count) to arrive before moving on
                            this.getThumbnailErrorCount++;

                            // Add a "we can't find it" image.
                            this.images.push(
                                {
                                    'imagePkId': data[i]['imagePkId'],
                                    /*
                                        'seriesInstanceUid': data[i]['seriesInstanceUid'],
                                        'sopInstanceUid': data[i]['sopInstanceUid'],
                                        'studyInstanceUid': data[i]['studyInstanceUid'],
                                    */

                                    'seq': i
                                }
                            );
                            // this.getThumbnailsEmitter.emit( thumbnailError );
                        }
                    );
                }
                this.loading = false;


            },
            err => {
                this.loading = false;
                //  this.getImageDrillDownDataErrorEmitter.emit( err );

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
                await this.commonService.sleep( Consts.waitTime );
            }
            this.loadingX = false;
        }
        // this.commonService.setHaveAllData( true );
        this.haveAllData = true;
        // Sort by seq here - need to sort, they may not have arrived from the server in the order they where requested.
        this.images.sort( ( row1, row2 ) => (row1.seq - row2.seq) );
    }


    getThumbnails( seriesUid, objectId, accessToken ): Observable<any> {
        let post_url = Properties.API_SERVER_URL + '/nbia-api/services/getThumbnail';
        let headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer  ' + this.apiServerService.showToken()
        } );

        let data = 'seriesUID=' + seriesUid + '&objectUID=' + objectId;

        if( Properties.DEBUG_CURL ){
            let curl = 'curl -H \'Authorization:Bearer ' + this.apiServerService.showToken() + '\' -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
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
            if( !this.haveDicomData ){
                this.apiServerService.dataGet( Consts.DICOM_TAGS_BY_IMAGE, query );
            }
        }
    }

    /////////////////////////
    onDragBegin( e ) {
        this.handleMoving = true;
    }

    onDragEnd( e ) {
    }

    onMoving( e ) {
    }

    onMoveEnd( e ) {
        this.handleMoving = false;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
