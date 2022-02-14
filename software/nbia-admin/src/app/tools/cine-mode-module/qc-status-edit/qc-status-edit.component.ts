// ----------------------------------------------------------------------------------------
// ----------                    QC Edit for Cine mode only                    ------------
// ----------  Used in the bottom section of "Perform Quality Control" cine mode  ---------
// ----------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilService } from '@app/admin-common/services/util.service';
import { SearchResultByIndexService } from '@app/tools/search-results-section-module/services/search-result-by-index.service';
import { Consts } from '@app/constants';
import { Properties } from '@assets/properties';
import { PreferencesService } from '@app/preferences/preferences.service';
import { ReleaseDateCalendarService } from '@app/tools/perform-qc-module/perform-qc/release-date-calendar/release-date-calendar.service';
import { CineModeBravoService } from '@app/tools/cine-mode-module/cine-mode-bravo/cine-mode-bravo.service';


@Component( {
    selector: 'nbia-qc-status-edit',
    templateUrl: './qc-status-edit.component.html',
    styleUrls: ['./qc-status-edit.component.scss'],
} )

export class QcStatusEditComponent implements OnInit, OnDestroy{
    @Input() collectionSite;
    @Input() seriesData;

    searchResults;
    useBatchNumber = false;
    batchNumber = 1;
    YES = 2;
    NO = 1;
    NO_CHANGE = 0;
    logText = '';
    isComplete = this.NO_CHANGE;
    isReleased = this.NO_CHANGE;
    visible = -1;
    qcStatuses; //  = Consts.QC_STATUSES;
    currentFont;

    releasedDate;
    showReleasedDateCalendar = false;
    badReleasedDate = false;

    showUpdateDescriptionUri = false;
    showCineUpdateCollectionSite = false;
    descriptionUri = '';
    siteArray = []; // For Update site dropdown
    newSiteCine = 'XXX';
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private cineModeService: CineModeBravoService,
        private apiService: ApiService,
        private utilService: UtilService,
        private searchResultByIndexService: SearchResultByIndexService,
        private preferencesService: PreferencesService,
        private releaseDateCalendarService: ReleaseDateCalendarService,
    ){
        let d = new Date();

        this.releasedDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    }

    ngOnInit(){
        this.apiService.visibilitiesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.qcStatuses = data;
            } );

        this.apiService.getSitesForSeriesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.siteArray = data;
            } );

        this.cineModeService.displayCineModeBravoImagesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.seriesData = undefined;  // So we can tell when it has been (re)populated
                this.apiService.getSites( [data.series['series'] ]);
                this.updateSiteList();
            } );

        this.releaseDateCalendarService.releaseDateEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.releasedDate = data.date['month'] + '/' + data.date['day'] + '/' + data.date['year'];
                this.showReleasedDateCalendar = false;
                this.cineCalendarTextInputChange();
            } );

        this.apiService.getVisibilities();

        this.preferencesService.setFontSizePreferencesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.currentFont = data;
            } );

        // Get the initial value
        this.currentFont = this.preferencesService.getFontSize();

    }

    onShowUpdateDescriptionUriClick(){
       // console.log( 'MHL Cine onShowUpdateDescriptionUriClick showUpdateDescriptionUri: ', this.showUpdateDescriptionUri );
    }



    async updateSiteList(){
        let runaway = 10;

        while( (this.seriesData === undefined) && runaway > 0 ){
            runaway--;
            await this.utilService.sleep( 500 );
        }
        this.apiService.getSites( [this.seriesData['series'] ]);
    }

    onShowCineUpdateCollectionSiteClick(){
        // console.log( 'MHL onShowCineUpdateCollectionSiteClick' );
    }

    onQcBulkStatusClick( n ){
        this.visible = n;
    }

    onQcBulkStatusCompleteClick( c ){
        this.isComplete = c;
    }

    onQcBulkStatusReleasedClick( r ){
        this.isReleased = r;
    }

    onQcUpdateNextClick(){
        this.onQcUpdate();
        this.searchResultByIndexService.updateCurrentSearchResultByIndex( 0 );
    }

    onQcSkipNextClick(){
        // TODO this is for the high light in the search results, it must be renamed
        this.searchResultByIndexService.updateCurrentSearchResultByIndex( 0 );
    }

    onQcUpdate(){
        // @CHECKME let query = 'projectSite=' + this.collectionSite;
        let query = '';
        query += '&seriesId=' + this.seriesData['series'];

        if( this.isComplete === this.YES ){
            query += '&complete=Complete';
        }
        if( this.isComplete === this.NO ){
            query += '&complete=NotComplete';
        }
        if( this.isReleased === this.YES ){
            query += '&released=released';
            query += '&dateReleased=' + this.releasedDate;
        }
        if( this.isReleased === this.NO ){
            query += '&released=NotReleased';
        }

        if( this.showUpdateDescriptionUri ){
            query += '&url=' + this.descriptionUri;
        }

        if( this.useBatchNumber ){
            query += '&batch=' + this.batchNumber;
        }

        if( this.visible >= 0 ){
            query += '&newQcStatus=' + Consts.QC_STATUSES[this.visible];
        }

        if( !this.utilService.isNullOrUndefinedOrEmpty( this.logText ) ){
            query += '&comment=' + this.logText;
        }

        // console.log('MHL QcStatusEditComponent.onQcUpdate  showUpdateDescriptionUri: ', this.showUpdateDescriptionUri);
        if( Properties.DEMO_MODE ){
            console.log( 'DEMO mode: Perform QC  Update ', query );
        }else{
            this.apiService.doSubmit( Consts.TOOL_BULK_QC, query );

            // Make the call to update the Site for this series
            if( this.showCineUpdateCollectionSite ){
                if( Properties.DEMO_MODE ){
                    console.log( 'DEMO mode - NOT updating Series Site.' );
                }else{
                    this.apiService.submitSiteForSeries( this.newSiteCine, [this.seriesData['series']] ); // It's expecting an array
                }
            }
        }
    }

    // This should not be needed, but the ngModel for the Select isn't setting newSiteCine
    onSiteOptionClick( s ){
        this.newSiteCine = s;
    }

    cineCalendarTextInputChange(){
        let m = -1;
        let d = -1;
        let y = -1;
        let date3 = new Date();

        this.badReleasedDate = true;

        // Do we have a good date
        if( this.utilService.isGoodDate( this.releasedDate ) ){
            this.badReleasedDate = false;
            let parts = this.releasedDate.split( '/' );

            m = +parts[0] - 1;
            // this.date3.setMonth( this.month - 1 );
            date3.setMonth( m );

            d = +parts[1];
            date3.setDate( +parts[1] );

            y = +parts[2];
            date3.setFullYear( y );
        }else{
            this.badReleasedDate = true;
        }

    }

    releasedCalendarIconClick( e ){
        this.showReleasedDateCalendar = (!this.showReleasedDateCalendar);
    }

    ngOnDestroy()
        :
        void{
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
