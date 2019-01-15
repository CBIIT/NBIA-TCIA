import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Consts } from '@app/consts';
import { CommonService } from '@app/image-search/services/common.service';
import { UtilService } from '@app/common/services/util.service';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';
import { ParameterService } from '@app/common/services/parameter.service';

import { Subject } from 'rxjs';

@Component( {
    selector: 'nbia-text-search',
    templateUrl: './text-search.component.html',
    styleUrls: ['./text-search.component.scss']
} )

export class TextQueryComponent implements OnInit, OnDestroy{
    textQueryInput;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiServerService: ApiServerService, private commonService: CommonService,
                 private loadingDisplayService: LoadingDisplayService, private parameterService: ParameterService,
                 private utilService: UtilService ) {
    }

    ngOnInit() {

        // Called when the "Clear" button on the left side of the Query display at the top is clicked.
        this.commonService.resetAllTextSearchEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {

                this.resetAll();
            }
        );

        // If there is Text search sent as a URL parameter
        this.parameterService.parameterTextSearchEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.textQueryInput = data;
                this.onSearchClick();
                this.apiServerService.setTextSearchQueryHold( data );

            }
        )
    }

    /**
     * To reset everything to it's initial state when the "Clear" button on the left side of the display query or after a new user has logged in.
     */
    resetAll() {
        this.onClearClick();
    }

    /**
     * Called when the user clicks "Clear" in the Text search part of the UI.<br>
     * Called by resetAll() when the "Clear" button on the left side of the Query display at the top is clicked.
     */
    onClearClick() {
        // Clear the text input in the UI.
        this.textQueryInput = '';

        // Clear the Display query at the top.
        this.commonService.emitTextSearchQueryForDisplay( '' );

        // This clears the search results that are being stored, which are used to restore the "Text Search" results
        // when the user switches back to "Text Search" from "Simple Search" or "Query Builder".
        this.commonService.setTextSearchResults( '' );

        //  FIXME  Don't emit this from here.
        // Clear the Search results table.
        this.apiServerService.textSearchResultsEmitter.emit( [] );

        // 0 means no results from a search,  -1 means no search
        this.commonService.updateSearchResultsCount( -1 );

        this.apiServerService.setTextSearchQueryHold( '' );

    }

    /**
     * Update the Display query, and run the search.
     */
    onSearchClick() {
        if( this.utilService.isNullOrUndefined( this.textQueryInput ) || (this.textQueryInput.length < 1) ){
            this.onClearClick();
            this.apiServerService.setTextSearchQueryHold( '' );
        }
        else{
            this.textQueryInput = this.textQueryInput.replace( /(\r\n|\r|\n)/g, '' );

            this.loadingDisplayService.setLoading( true, 'Searching...' );
            this.commonService.emitTextSearchQueryForDisplay( this.textQueryInput );
            this.apiServerService.setTextSearchQueryHold( this.textQueryInput );

            this.apiServerService.doSearch( Consts.TEXT_SEARCH, 'textValue=' + this.textQueryInput.replace( /\\/, '\\\\' ) );
        }
    }

    onKeyupEnter() {
        this.textQueryInput = this.textQueryInput.replace( /(\r\n|\r|\n)/g, '' );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
