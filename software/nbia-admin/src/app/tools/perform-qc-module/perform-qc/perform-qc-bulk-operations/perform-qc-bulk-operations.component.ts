import { Component, Input, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { UtilService } from '@app/admin-common/services/util.service';
import { ApiService } from '@app/admin-common/services/api.service';
import { PerformQcService } from '../../services/perform-qc.service';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-perform-qc-bulk-operations',
    templateUrl: './perform-qc-bulk-operations.component.html',
    styleUrls: ['./perform-qc-bulk-operations.component.scss']
} )
export class PerformQcBulkOperationsComponent implements OnInit{
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

    qcStatuses = Consts.QC_STATUSES;

    cBox = [];

    constructor( private utilService: UtilService, private apiService: ApiService,
                 private performQcService: PerformQcService) {
    }

    ngOnInit() {
    }

    onQcBulkStatusClick( i ) {
        this.visible = i;
    }

    onQcBulkStatusCompleteClick( c ) {
        this.isComplete = c;
    }

    onQcBulkStatusReleasedClick( r ) {
        this.isReleased = r;
    }

    onQcBulkUpdateClick(){
        let query = 'projectSite=' + this.collectionSite;
        for(let row of this.searchResults ){
            if( row['selected'] ){
                query += '&seriesId=' + row['series'];
            }
        }
        if(  this.isComplete === this.YES ){
            query += '&complete=Complete';
        }
        if(  this.isComplete === this.NO ){
            query += '&complete=NotComplete'; // TODO Get the correct arg from Scott.
        }
        if(  this.isReleased === this.YES ){
            query += '&released=released';
        }
        if(  this.isReleased === this.NO ){
            query += '&released=NotReleased'; // TODO Get the correct arg from Scott.
        }

        if( this.useBatchNumber ){
            query += '&batch=' + this.batchNumber;
        }

        if( this.visible >= 0){
             query += '&newQcStatus=' + Consts.QC_STATUSES[this.visible];
        }

        if(! this.utilService.isNullOrUndefinedOrEmpty( this.logText)){
            query += '&comment=' + this.logText;
        }

        if( Properties.DEMO_MODE){
            console.log('DEMO mode: Perform QC  Update ', query );
        }
        else{
            this.apiService.doSubmit(Consts.TOOL_BULK_QC, query);
        }
    }


    onQcStatusHistoryReportClick(){
        let query = '';
        for(let row of this.searchResults ){
            if( row['selected'] ){
                query += '&seriesId=' + row['series'];
            }
        }

        this.apiService.doSubmit( Consts.GET_HISTORY_REPORT, query);
    }

    onDownloadClick(){
        let query = '';
        for(let row of this.searchResults ){
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
}
