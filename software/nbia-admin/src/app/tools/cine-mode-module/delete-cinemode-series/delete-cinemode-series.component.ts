import { Component, Input, OnInit } from '@angular/core';
import { SearchResultByIndexService } from '@app/tools/search-results-section-module/services/search-result-by-index.service';
import { Consts } from '@app/constants';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-delete-cinemode-series',
    templateUrl: './delete-cinemode-series.component.html',
    styleUrls: ['./delete-cinemode-series.component.scss']
} )
export class DeleteCinemodeSeriesComponent implements OnInit{
    @Input() seriesData;
    searchResults;
    logText = '';

    constructor( private searchResultByIndexService: SearchResultByIndexService, private apiService: ApiService,
                 private utilService: UtilService) {
    }

    ngOnInit() {
    }

    onDeleteSeriesNextClick() {
        let query = 'seriesId=' + this.seriesData['series'];
        if( this.logText.length > 0 ){
            query += '&comment=' + this.logText;
        }

        if( Properties.DEMO_MODE){
            console.log('DEMO mode: Delete ', query );
        }
        else{
            this.apiService.doSubmit(Consts.TOOL_APPROVE_DELETIONS, query);
            this.searchResultByIndexService.updateCurrentSearchResultByIndex( 0 );
        }
    }

    onDeleteSeriesSkipNextClick() {
        // FIXMENOW this is for the high light in the search results, it must be renamed and the index removed, it only increments.
        this.searchResultByIndexService.updateCurrentSearchResultByIndex( 0 );
    }

}
