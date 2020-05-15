import { Component, Input, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { ApiService } from '@app/admin-common/services/api.service';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-deletion-bulk-operations',
    templateUrl: './deletion-bulk-operations.component.html',
    styleUrls: ['./deletion-bulk-operations.component.scss']
} )
export class DeletionBulkOperationsComponent implements OnInit{
    @Input() searchResults;
    @Input() searchResultsSelectedCount = 0;
    @Input() collectionSite = '';

    logText = '';

    constructor( private apiService: ApiService ) {
    }

    ngOnInit() {
    }

    onBulkDeleteClick() {
        let query = '';
        for(let row of this.searchResults ){
            if( row['selected'] ){
                query += '&seriesId=' + row['series'];
            }
        }
        if( this.logText.length > 0 ){
            query += '&comment=' + this.logText;
        }
        if( Properties.DEMO_MODE){
            console.log('DEMO mode: Bulk Delete ', query );
        }
        else{
            this.apiService.doSubmit( Consts.TOOL_APPROVE_DELETIONS, query.slice( 1 ) );
        }
    }
}
