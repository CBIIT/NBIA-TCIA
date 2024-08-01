// ----------------------------------------------------------------------------------------
// ----------             New Status for Perform Quality Control                  ---------
// ----------------------------------------------------------------------------------------
// ----------       @TODO This is very similar to QcStatusEditComponent           ---------
//  ---------            "Perform Quality Control" cine mode.                     ---------
//  ---------             Can these be combined into one component?               ---------
// ----------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { UtilService } from '@app/admin-common/services/util.service';
import { ApiService } from '@app/admin-common/services/api.service';
import { Properties } from '@assets/properties';
import { takeUntil } from 'rxjs/operators';
import { PreferencesService } from '@app/preferences/preferences.service';
import { Subject } from 'rxjs';
import { SearchResultsSectionBravoService } from '@app/tools/search-results-section-module/search-results-section-bravo/search-results-section-bravo.service';
import { ReleaseDateCalendarService } from '@app/tools/perform-qc-module/perform-qc/release-date-calendar/release-date-calendar.service';


@Component( {
    selector: 'nbia-perform-qc-bulk-operations',
    templateUrl: './perform-qc-bulk-operations.component.html',
    styleUrls: ['./perform-qc-bulk-operations.component.scss']
} )

export class PerformQcBulkOperationsComponent implements OnInit, OnDestroy{
    @Input() searchResults;
    @Input() searchResultsSelectedCount = 0;
    @Input() collectionSite = '';

    useBatchNumber = false;
    batchNumber = 1;
    YES = 2;
    NO = 1;
    NO_CHANGE = 0;
    logText = '';
    isComplete = this.NO_CHANGE;
    isReleased = this.NO_CHANGE;
    visible = -1;

    showReleaseCalendar = false;
    qcStatuses = Properties.QC_STATUSES;
    currentFont;

    cBox = [];
    selectedSiteIdArray = [];
    siteDropdownArray = [];
    showUpdateCollectionSite = false;
    showUpdateDescriptionUri = false;
    descriptionUri = '';
    showReleasedDateCalendar = false; // TODO rename this
    newSite = this.siteDropdownArray[0];

    releaseDate;
    badReleasedDate;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
    loadingDisplayService: any;

    constructor( private utilService: UtilService, private apiService: ApiService,
                 private preferencesService: PreferencesService, private searchResultsSectionBravoService: SearchResultsSectionBravoService,
                 private releaseDateCalendarService: ReleaseDateCalendarService ){
        let d = new Date();
        this.releaseDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    }

    ngOnInit(){
 /*       this.apiService.visibilitiesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.qcStatuses = data;
            } );
        this.apiService.getVisibilities();
*/
        this.preferencesService.setFontSizePreferencesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentFont = data;
            } );

        this.releaseDateCalendarService.showPopupCalendarEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showReleaseCalendar = data;
            } );

        this.releaseDateCalendarService.releaseDateEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.releaseDate = data.date['month'] + '/' + data.date['day'] + '/' + data.date['year'];
            } );

        this.searchResultsSectionBravoService.selectionChangeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.upDateSelectedSiteIdArray();
            } );


        this.apiService.getSitesForSeriesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( typeof data === 'object' && data[0].length > 1 ){
                    this.siteDropdownArray = data;
                    this.newSite = this.siteDropdownArray[0];

                }else{
                    if( data.startsWith( 'The series do not belong to one collection' ) ){
                        if( this.showUpdateCollectionSite ){
                            alert( 'Can not update Series Sites for series from multiple Collections.\nDeselecting "Update Site"' );
                            this.showUpdateCollectionSite = false; // @CHECKME Should we flip the checkbox?
                        }
                    }else{
                        this.siteDropdownArray = data;
                        alert( 'getSitesForSeriesEmitter error' );
                    }

                }

            },
            err => {
                alert( 'err: ' + err['message'] );
            }
        );

        // Get the initial value
        this.currentFont = this.preferencesService.getFontSize();

        this.logText = '';
    }

    releasedCalendarIconClick( e ){
        this.showReleaseCalendar = !this.showReleaseCalendar;
    }

    onShowUpdateCollectionSiteClick(){
        this.upDateSelectedSiteIdArray();
    }


    /**
     * Makes an array of selected series IDs  this.selectedSiteIdArray
     */
    upDateSelectedSiteIdArray(){
        this.selectedSiteIdArray = [];
        let tempSearchResultsSelectedCount = 0;
        for( let f = 0; f < this.searchResults.length; f++ ){
            if( this.searchResults[f]['selected'] ){
                this.selectedSiteIdArray.push( this.searchResults[f]['series'] );
                tempSearchResultsSelectedCount++;
            }
        }
        if( tempSearchResultsSelectedCount < 1 ){
            this.showUpdateCollectionSite = false;
        }
        this.updateSiteList();
    }

    async updateSiteList(){
        let runaway = 10;
        this.apiService.getSites( this.selectedSiteIdArray );

        while( (this.selectedSiteIdArray === undefined || this.selectedSiteIdArray.length === undefined || this.selectedSiteIdArray.length < 1) && runaway > 0 ){
            runaway--;
            await this.utilService.sleep( 500 );
        }

    }


    onQcBulkStatusClick( i ){
        this.visible = i;
    }

    onQcBulkStatusCompleteClick( c ){
        this.isComplete = c;
    }

    onQcBulkStatusReleasedClick( r ){
        this.showReleasedDateCalendar = r === this.YES;
        this.isReleased = r;
    }

    onQcBulkStatusReleasedClickYes( event ){
        this.showReleasedDateCalendar = true;
    }

    onQcBulkUpdateClick(){
        this.loadingDisplayService.setLoading(true, 'Updating series, please wait...');
        // @CHECKME let query = 'projectSite=' + this.collectionSite;
        let query = '';
        for( let row of this.searchResults ){
            if( row['selected'] ){
                query += '&seriesId=' + row['series'];
            }
        }

        if( this.isComplete === this.YES ){
            query += '&complete=Complete';
        }
        if( this.isComplete === this.NO ){
            query += '&complete=NotComplete';
        }

        if( this.showUpdateDescriptionUri ){
            query += '&url=' + this.descriptionUri;
        }

        // Add Yes for isReleased and released Date
        if( this.isReleased === this.YES ){
            query += '&released=released&dateReleased=' + this.releaseDate;
        }
        if( this.isReleased === this.NO ){
            query += '&released=NotReleased';
        }

        if( this.useBatchNumber ){
            query += '&batch=' + this.batchNumber;
        }

        if( this.visible >= 0 ){
            query += '&newQcStatus=' + Properties.QC_STATUSES[this.visible];
        }

        if( !this.utilService.isNullOrUndefinedOrEmpty( this.logText ) ){
            query += '&comment=' + this.logText;
        }

        if( Properties.DEMO_MODE ){
            console.log( 'DEMO mode: Perform QC  Update ', query );
        }else{
            // apiService
            this.apiService.doSubmit( Consts.TOOL_BULK_QC, query );
        }


        // Update the series site if "Update" checkbox is selected
        if( this.showUpdateCollectionSite ){

            let seriesForNewSite = [];
            for( let row of this.searchResults ){
                if( row['selected'] ){
                    seriesForNewSite.push( row['series'] );
                }
            }
            if( Properties.DEMO_MODE ){
                console.log( 'DEMO mode submitSiteForSeries', this.apiService.submitSiteForSeries( this.newSite, seriesForNewSite ) );
                // console.log( 'DEMO mode submitSiteForSeries', this.apiService.submitSiteForSeries( this.siteDropdownArray[this.newSite], seriesForNewSite ) );
            }else{
                this.apiService.submitSiteForSeries( this.newSite, seriesForNewSite );
                // this.apiService.submitSiteForSeries( this.siteDropdownArray[this.newSite], seriesForNewSite );
            }
        }

        this.loadingDisplayService.setLoading(false);
    }

    onSiteOptionClick( i ){
        this.newSite = i;
    }

    onQcStatusHistoryReportClick(){
        let query = '';
        for( let row of this.searchResults ){
            if( row['selected'] ){
                query += '&seriesId=' + row['series'];
            }
        }

        this.apiService.doSubmit( Consts.GET_HISTORY_REPORT, query );
    }

	onSeriesReportClick(){
        let query = '';
        for( let row of this.searchResults ){
            if( row['selected'] ){
                query += '&seriesId=' + row['series'];
            }
        }

        this.apiService.doSubmit( Consts.GET_SERIES_REPORT, query );
    }

    onDownloadClick(){
        let query = '';
        for( let row of this.searchResults ){
            if( row['selected'] ){
                query += '&list=' + row['series'];
            }
        }
        query = query.substr( 1 );

        // Call Rest service to generate the '.tcia download manifest file.
        this.apiService.downloadSeriesList( query ).subscribe(
            data => {
                let tciaManifestFile = new Blob( [data], { type: 'application/x-nbia-manifest-file' } );

                //  This worked, but I could not figure out how to set the file name.
                // let url= (<any>window).URL.createObjectURL(tciaManifestFile);
                // (<any>window).open(url);

                // This works
                // TODO in the manifest download popup, it says 'from: blob:'  see if we can change this.
                let objectUrl = (<any>window).URL.createObjectURL( tciaManifestFile );
                let a = (<any>window).document.createElement( 'a' );
                a.href = objectUrl;
                // Use epoch for unique file name
                a.download = 'NBIA-manifest-' + new Date().getTime() + '.tcia';
                (<any>window).document.body.appendChild( a );
                a.click();
                (<any>window).document.body.removeChild( a );


            },
            err => {
                // TODO React to this error
                console.error( 'Error downloading cart/manifest: ', err );

            }
        );
    }

    calendarTextInputChange(){
        let m = -1;
        let d = -1;
        let y = -1;
        let date3 = new Date();

        this.badReleasedDate = true;

        // Do we have a good date
        if( this.utilService.isGoodDate( this.releaseDate ) ){
            this.badReleasedDate = false;
            let parts = this.releaseDate.split( '/' );

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


    ngOnDestroy(): void{
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
