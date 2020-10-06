// -------------------------------------------------------------------------
// -------                    "Approve Deletion"                      ------
// -------       Used in "Approve Deletion" when in Cine mode.        ------
// -------------------------------------------------------------------------

import { Component, Input, OnInit } from '@angular/core';
import { SearchResultByIndexService } from '@app/tools/search-results-section-module/services/search-result-by-index.service';
import { Consts } from '@app/constants';
import { ApiService } from '@app/admin-common/services/api.service';
import { Properties } from '@assets/properties';


/**
 * This is the bottom part of "Approve Deletion" when in Cine mode.
 */
@Component( {
    selector: 'nbia-delete-cinemode-series',
    templateUrl: './delete-cinemode-series.component.html',
    styleUrls: ['./delete-cinemode-series.component.scss'],
} )

export class DeleteCinemodeSeriesComponent implements OnInit{
    @Input() seriesData;
    searchResults;
    logText = '';

    constructor(
        private searchResultByIndexService: SearchResultByIndexService,
        private apiService: ApiService
    ) {
    }

    ngOnInit() {
    }

    /**
     * Make rest call to approve this deletion and move the highlight in the search results table to the next record.
     */
    onDeleteSeriesNextClick() {
        // Setup parameters for rest call.
        let query = 'seriesId=' + this.seriesData['series'];
        if( this.logText.length > 0 ){
            query += '&comment=' + this.logText;
        }

        // If we are in Demo mod (read only), just display the parameters in the browser console.
        if( Properties.DEMO_MODE ){
            console.log( 'DEMO mode: Delete ', query );
        }else{
            // If not in Demo mode, make the rest call to approve this deletion.
            this.apiService.doSubmit( Consts.TOOL_APPROVE_DELETIONS, query );
            // Move the high light in the search results to the next record.
            this.searchResultByIndexService.updateCurrentSearchResultByIndex( 0 );
        }
    }

    onDeleteSeriesSkipNextClick() {
        // TODO this is for the high light in the search results, it must be renamed and the index removed, it only increments.
        this.searchResultByIndexService.updateCurrentSearchResultByIndex( 0 );
    }
}
