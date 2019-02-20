import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Consts } from '@app/consts';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';
import { AlertBoxService } from '@app/common/components/alert-box/alert-box.service';
import { AlertBoxButtonType, AlertBoxType } from '@app/common/components/alert-box/alert-box-consts';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-series-details',
    templateUrl: './series-details.component.html',
    styleUrls: ['../subject-study-details.component.scss',
        '../../search-results-table.component.scss', './series-details.component.scss']
} )
export class SeriesDetailsComponent implements OnInit, OnDestroy{

    @Input() currentSubjectDetailRow = '';
    @Input() study;
    @Input() id;

    // Make sure we update this if we add/remove columns from a Series display row.  Used for column span of DICOM td
    columnCount = 8;
    seriesListForDisplay = [];
    dicomDataShowQ = [];
    dicomData = [];
    parentDicomData = [];
    currentDicom = -1;
    haveDicomData = [];
    seriesId;
    imageUidArray = [];

    properties = Properties;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiServerService: ApiServerService, private loadingDisplayService: LoadingDisplayService,
                 private alertBoxService: AlertBoxService ) {
    }

    ngOnInit() {
        // CHECKME  Make sure study is populated by now.
        this.upDataSearchResultsForDisplay();

        for( let f = 0; f < this.seriesListForDisplay.length; f++ ){
            this.dicomDataShowQ[f] = false;
            this.haveDicomData[f] = false;
        }

        this.apiServerService.getDicomTagsEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                if( data['id'] === this.seriesId ){
                    this.parentDicomData[this.currentDicom] = data['res'];
                    this.imageUidArray[this.currentDicom] = this.getImageId();
                    this.loadingDisplayService.setLoading( false );
                }
            }
        );
        this.apiServerService.getDicomTagsErrorEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            err => {
                if( err['id'] === this.seriesId ){
                    this.loadingDisplayService.setLoading( false );

                    let len = this.dicomDataShowQ.length;
                    for( let f = 0; f < len; f++ ){
                        this.dicomDataShowQ[f] = false;
                    }

                    let text = [];
                    text.push( err['err']['statusText'] + ' - ' + err['err']['status'] );
                    // text.push( err.err['_body'] );
                    this.alertBoxService.alertBoxDisplay( 'nbia-series-details-00',
                        AlertBoxType.ERROR,
                        'Error retrieving DICOM data!',
                        text,
                        AlertBoxButtonType.OKAY
                    );
                }
            }
        );

    }

    getImageId() {
        let len = this.parentDicomData[this.currentDicom].length;
        for( let f = 0; f < len; f++ ){
            if( this.parentDicomData[this.currentDicom][f]['name'].toUpperCase() === 'MEDIA STORAGE SOP INSTANCE UID' ){
                return this.parentDicomData[this.currentDicom][f]['data'];
            }
        }

    }


    onDicomClick( i ) {
        this.dicomDataShowQ[i] = !this.dicomDataShowQ[i];
        if( this.dicomDataShowQ[i] && (!this.haveDicomData[i]) ){
            this.loadingDisplayService.setLoading( true, 'Loading DICOM data' );

            this.seriesId = (this.seriesListForDisplay[i - 1])['seriesUID'];
            let query = 'SeriesUID=' + this.seriesId;
            this.apiServerService.dataGet2( Consts.DICOM_TAGS, query );

            this.currentDicom = i;

            // So we do no  query for DICOM data if we already have it for this series
            this.haveDicomData[i] = true;
        }
    }


    /**
     * Adds an empty row after each row of data.  The empty row will let us insert a subject-study-details in the ngFor loop
     */
    upDataSearchResultsForDisplay() {
        this.seriesListForDisplay = [];
        for( let row of this.study.seriesList ){
            this.seriesListForDisplay.push( row );
            this.seriesListForDisplay.push( {} );
        }
    }

    onThumbnailClick( seriesId ) {

        window.open( Properties.API_SERVER_URL  +
            '/' + Properties.THUMBNAIL_URL + '?' +
            Properties.URL_KEY_THUMBNAIL_SERIES + '=' +
            encodeURI(seriesId.seriesPkId) + '&' +
            Properties.URL_KEY_THUMBNAIL_DESCRIPTION + '=' +
            encodeURI(seriesId.description),
            '_blank' );
    }


    onCineModeClick() {
        alert( 'This feature has not yet been implemented.' );
    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
