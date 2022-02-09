// ----------------------------------------------------------------------------------------
// ----------------------        "Perform Quality Control"         ------------------------
// ----------------------------------------------------------------------------------------

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Consts, TokenStatus } from '@app/constants';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { QuerySectionService } from '../../query-section-module/services/query-section.service';
import { Subject } from 'rxjs';
import { LoadingDisplayService } from '@app/admin-common/components/loading-display/loading-display.service';
import { Properties } from '@assets/properties';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';
import { DynamicQueryBuilderService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-builder.service';


@Component( {
    selector: 'nbia-perform-qc',
    templateUrl: './perform-qc.component.html',
    styleUrls: ['./perform-qc.component.scss'],
} )

/**
 * The parent component for "Perform QC"
 */
export class PerformQcComponent implements OnInit, OnDestroy{
    consts = Consts;
    userRoles;
    roleIsGood = false;
    currentQueryData = [];
    showBulkOperations = false;
    collectionSite = '';

    searchResults = {};
    searchResultsSelectedCount = 0;
    searchType = Properties.DEFAULT_SEARCH_TAB;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private apiService: ApiService,
        private accessTokenService: AccessTokenService,
        private utilService: UtilService,
        private querySectionService: QuerySectionService,
        private dynamicQueryBuilderService: DynamicQueryBuilderService,
        private loadingDisplayService: LoadingDisplayService
    ){}

    async ngOnInit(){
        this.querySectionService.updateSearchTypeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.searchType = data;
            } );


        // Get the users roles and make sure they have 'NCIA.MANAGE_VISIBILITY_STATUS'
        this.apiService.updatedUserRolesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.userRoles = data;
                if(
                    this.userRoles !== undefined &&
                    this.userRoles.indexOf( 'NCIA.MANAGE_VISIBILITY_STATUS' ) > -1
                ){
                    this.roleIsGood = true;
                }
            } );


        // Get updated query criteria when user query on the left changes and (re)runs the query.
        this.querySectionService.updatedQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.currentQueryData = data;
                this.collectionSite = this.getCollectionSite();
                this.loadingDisplayService.setLoading( true, 'Searching...' );

                // Run the query
                this.doPerformQcSearch();
            } );



        // Rerun the current query after the user has made changes, not to the query, but to the data.
        this.apiService.submitBulkQcResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                console.log('MHL ZEB ZEB00 subscribe: 00');
                this.apiService.doAdvancedQcSearch(this.dynamicQueryBuilderService.buildServerQuery(), true ); // @CHECKME Does this update Search results screen
            } );



        // Check for search results.  If there are none, don't show bulk operations.
        this.apiService.searchResultsEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                console.log('MHL NOG05 data: ', data);

                this.showBulkOperations =
                    data[0] !== Consts.NO_SEARCH && data.length > 0;
            } );

        this.init();
    }

    async init(){
        // Make sure we are logged in
        while( (this.accessTokenService.getAccessToken() === undefined) || this.accessTokenService.getAccessToken() <= TokenStatus.NO_TOKEN_YET ){
            await this.utilService.sleep( Consts.waitTime );
        }
        this.apiService.getRoles();
    }


    // Run the query
    doPerformQcSearch(){
        this.apiService.doCriteriaSearchQuery(
            Consts.TOOL_PERFORM_QC,
            this.currentQueryData
        );
    }

    // This method is bound to resultsUpdateBravoEmitter in search-results-section-bravo component.
    onSearchResultsUpdate( e ){
        console.log('MHL ZZZZZ PerformQcComponent.onSearchResultsUpdate onSearchResultsUpdate: ', e );
        if( !this.utilService.isNullOrUndefinedOrEmpty( e ) ){
            this.searchResults = e;
        }
    }

    // This method is bound to resultsSelectCountUpdateBravoEmitter in search-results-section-bravo component.
    onResultsSelectCountUpdate( e ){
        console.log('MHL AAAA PerformQcComponent.onResultsSelectCountUpdate onResultsSelectCountUpdate e: ', e);
        this.searchResultsSelectedCount = e;
    }

    getCollectionSite(){
        for( let row of this.currentQueryData ){
            if( row['criteria'] === Consts.QUERY_CRITERIA_COLLECTION ){
                return row['data'];
            }
        }
        return '';
    }

    ngOnDestroy(){
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
