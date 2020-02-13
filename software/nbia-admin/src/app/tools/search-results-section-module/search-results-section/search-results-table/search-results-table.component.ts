import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '../../../../admin-common/services/api.service';
import { CineModeService } from '../../../cine-mode-module/cine-mode/cine-mode.service';

@Component( {
    selector: 'nbia-search-results-table',
    templateUrl: './search-results-table.component.html',
    styleUrls: ['./search-results-table.component.scss']
} )
export class SearchResultsTableComponent implements OnInit{

    searchResults;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService, private cineModeService: CineModeService ) {
    }

    ngOnInit() {

        this.apiService.ApproveDeletionsSearchResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.searchResults = data;
                console.log('MHL SearchResultsTableComponent.ngOnInit ApproveDeletionsSearchResultsEmitter data: ', data);
            } );

    }

    toggleSearchResultsCheckbox() {

    }

    onClickViewThumbnail( i ) {
        console.log( 'MHL ********  onClickViewThumbnail(' + i + ') this.searchResults[' + i + ']: ', this.searchResults[i] );
        this.cineModeService.openCineMode( 0, 0, 0, 0 );

    }
}
