import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { ApiService } from '@app/admin-common/services/api.service';
import { Properties } from '@assets/properties';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PreferencesService } from '@app/preferences/preferences.service';
import { DynamicQueryBuilderService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-builder.service';


/**
 * Used as the bottom section of "Approve Deletions"
 */
@Component( {
    selector: 'nbia-deletion-bulk-operations',
    templateUrl: './deletion-bulk-operations.component.html',
    styleUrls: ['./deletion-bulk-operations.component.scss'],
} )

export class DeletionBulkOperationsComponent implements OnInit, OnDestroy{
    @Input() searchResults;
    @Input() searchResultsSelectedCount = 0;
    @Input() collectionSite = '';

    logText = '';
    currentFont;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService, private preferencesService: PreferencesService,
                 private dynamicQueryBuilderService: DynamicQueryBuilderService) {
    }

    ngOnInit() {
        // After the "Delete" has been done and the server has answered back.
        this.apiService.submitSeriesDeletionResultsEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( () => {
                // Rerun the query to update the search results table.
                this.apiService.doAdvancedQcSearch(this.dynamicQueryBuilderService.buildServerQuery() )

/*
                this.apiService.doCriteriaSearchQuery(
                    Consts.TOOL_APPROVE_DELETIONS,
                    [
                        {
                            criteria: Consts.QUERY_CRITERIA_COLLECTION,
                            data: this.collectionSite,
                        },
                    ]
                );
*/

                this.searchResultsSelectedCount = 0;
            } );

        // Listen for font size change.
        this.preferencesService.setFontSizePreferencesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.currentFont = data;
            } );

        // Get the initial font size value.
        this.currentFont = this.preferencesService.getFontSize();
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
            this.apiService.doSubmit(
                Consts.TOOL_APPROVE_DELETIONS,
                query.slice( 1 )
            );
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
