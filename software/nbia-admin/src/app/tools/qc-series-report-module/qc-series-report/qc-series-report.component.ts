// -------------------------------------------------------------------------------------------
// ------------  Series - popup in "Perform Quality Control"  not Cine mode  ---------
// -------------------------------------------------------------------------------------------

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/admin-common/services/common.service';
import { takeUntil, timeout} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '@app/admin-common/services/api.service';
import { Properties } from '@assets/properties';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';

@Component( {
    selector: 'nbia-qc-series-report',
    templateUrl: './qc-series-report.component.html',
    styleUrls: ['./qc-series-report.component.scss']
} )

export class QcSeriesReportComponent implements OnInit, OnDestroy{
    handleMoving = false;
    showReport = false;
    qcSeriesReportResults = [];
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
	properties = Properties;

    constructor(private apiService: ApiService, 
				private commonService: CommonService, 
				private accessTokenService: AccessTokenService,
				private httpClient: HttpClient) {
    }

    ngOnInit() { 
        this.apiService.qcSeriesResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                if (data !== null) {
              
                  this.qcSeriesReportResults = data;

                  
                  // Sort by Series Id then Time Stamp
                  this.qcSeriesReportResults.sort( ( row1, row2 ) =>
                      row1['Series Instance UID'] < row2['Series Instance UID'] ? 1 : row1['Series Instance UID'] > row2['Series Instance UID'] ? 1 : row1['Visibility'] < row2['Visibility'] ? -1 : 1 );
                  this.showReport = true;
                }
            } );

        this.commonService.downloadCartAsCsvEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                let query = 'seriesId=';

                let first = true;
                for( let series of <any>data ){   
                        if( first ){
                            first = false;
                        }else{
                            query += '&seriesId=';
                        }
                        query += series['Series Instance UID'];
                }
				query +='&format=csv';

                if( Properties.DEBUG_CURL ){
                    let curl = 'curl -O -H \'Authorization:Bearer  ' + this.accessTokenService.getAccessToken() + '\' -k \'' + Properties.API_SERVER_URL + '/nbia-api/services/getSeriesMetadata2' + '\' -d \'' + query + '\'';
                    console.log( 'downloadCartAsCsv: ', curl );
                }

                let csvDownloadUrl = Properties.API_SERVER_URL + '/nbia-api/services/v4/getSeriesQCInfo';

                let headers = new HttpHeaders( {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + this.accessTokenService.getAccessToken()
                } );

                let options = { headers: headers, responseType: 'text' as 'json'};

                this.httpClient.post( csvDownloadUrl, query, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) ).subscribe(
                    ( res ) => {		
                       let csvFile = new Blob( [<any>res], { type: 'text/csv' } );
                        // TODO in the manifest download popup, it says 'from: blob:'  see if we can change this.
                       let objectUrl = (<any>window).URL.createObjectURL( csvFile );
                       let a = (<any>window).document.createElement( 'a' );
                       a.href = objectUrl;
                        // Use epoch for unique file name
                      a.download = 'series-report' + new Date().getTime() + '.csv';
                       (<any>window).document.body.appendChild( a );
                        a.click();
                        (<any>window).document.body.removeChild( a );
                    }, error => {
                        console.error( 'Download csv file error:', error );
                    }
                );

                ///////////////////////////////////////////////////////////////////////////////

            }
        );

    }

    /////////////////////////
    onDragBegin( e ) {
        this.handleMoving = true;
    }

    onMoveEnd( e ) {
        this.handleMoving = false;
    }

    closeQcSeriesReportClick() {
        this.showReport = false;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
	
    /**
     * Start the csv download, cartListForDisplay is the same data in the cart screen,
     * @TODO make sure this is all the data we want exported
     * @TODO Do we want to export the formatted date, currently we are exporting as epoch?
     *
     */
    onDownloadCsvClick() {
        this.commonService.downloadCartAsCsv( this.qcSeriesReportResults);
		//this.downloadFile(this.qcSeriesReportResults);
    }
}
