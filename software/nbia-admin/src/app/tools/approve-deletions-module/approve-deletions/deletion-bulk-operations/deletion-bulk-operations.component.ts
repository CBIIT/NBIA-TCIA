import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { ApiService } from '@app/admin-common/services/api.service';
import { Properties } from '@assets/properties';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component( {
    selector: 'nbia-deletion-bulk-operations',
    templateUrl: './deletion-bulk-operations.component.html',
    styleUrls: ['./deletion-bulk-operations.component.scss']
} )
export class DeletionBulkOperationsComponent implements OnInit, OnDestroy{
    @Input() searchResults;
    @Input() searchResultsSelectedCount = 0;
    @Input() collectionSite = '';

    logText = '';

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService ) {
    }

    ngOnInit() {
        // After the "Delete" has been done and the server has answered back.
        this.apiService.submitSeriesDeletionResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                // Rerun the query to update the search results table.
                this.apiService.doCriteriaSearchQuery( Consts.TOOL_APPROVE_DELETIONS,
                    [{ 'criteria': Consts.QUERY_CRITERIA_COLLECTION, 'data': this.collectionSite }] );
                this.searchResultsSelectedCount = 0;

            } );
    }

    onBulkDeleteClick() {
        let query = '';
        for( let row of this.searchResults ){
            if( row['selected'] ){
                query += '&seriesId=' + row['series'];
            }
        }
        if( this.logText.length > 0 ){
            query += '&comment=' + this.logText;
        }
        if( Properties.DEMO_MODE ){
            console.log( 'DEMO mode: Bulk Delete ', query );
        }else{
            this.apiService.doSubmit( Consts.TOOL_APPROVE_DELETIONS, query.slice( 1 ) );

        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
