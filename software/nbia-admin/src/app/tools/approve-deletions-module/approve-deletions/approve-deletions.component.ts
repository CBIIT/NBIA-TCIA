import { Component, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuerySectionService } from '../../query-section-module/services/query-section.service';
import { LoginService } from '@app/login/login.service';
import { PreferencesService } from '@app/preferences/preferences.service';


/**
 *  Approve Deletions tool.
 *
 *  Uses query-section on the left side.
 *  Uses search-results-section-bravo.
 *  Uses deletion-bulk-operations.
 */
@Component( {
    selector: 'nbia-approve-deletions',
    templateUrl: './approve-deletions.component.html',
    styleUrls: ['./approve-deletions.component.scss'],
} )

export class ApproveDeletionsComponent implements OnInit, OnDestroy{
    userRoles;
    roleIsGood = false;
    currentQueryData = [];
    searchResults = {};
    searchResultsSelectedCount = 0;
    collectionSite = '';
    currentFont;
    showBulkOperations = false;

    consts = Consts;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private apiService: ApiService,
        private utilService: UtilService,
        private querySectionService: QuerySectionService,
        private loginService: LoginService,
        private preferencesService: PreferencesService
    ) {
    }

    async ngOnInit() {

        // Get this users roles and check for 'NCIA.SUPER_CURATOR'
        this.apiService.updatedUserRolesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.userRoles = data;
                if(
                    this.userRoles !== undefined &&
                    this.userRoles.indexOf( 'NCIA.SUPER_CURATOR' ) > -1
                ){
                    this.roleIsGood = true;
                }
            } );
        this.apiService.getRoles();


        // Gets the currently selected Collection//Site from the left side "Collection" criteria picker.
        this.querySectionService.updatedQueryEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.currentQueryData = data;
                this.collectionSite = this.getCollectionSite();
                this.doApproveDeletionsSearch();
            } );

        // Check for search results.  If there are none, don't show bulk operations.
        this.apiService.searchResultsEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.showBulkOperations =
                    data[0] !== Consts.NO_SEARCH && data.length > 0;
            } );

        // Get changes of font from Preferences.
        this.preferencesService.setFontSizePreferencesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.currentFont = data;
            } );

        // Get the initial font value.
        this.currentFont = this.preferencesService.getFontSize();
    }

    /**
     * This method is bound to "@Output() resultsUpdateBravoEmitter" in search-results-section-bravo.
     * When resultsUpdateBravoEmitter emits
     * @param queryResults - The query results from the Criteria Search on the left, which are marked for deletion.
     */
    onSearchResultsUpdate( queryResults ) {
        if( !this.utilService.isNullOrUndefinedOrEmpty( queryResults ) ){
            this.searchResults = queryResults;
        }
    }

    /**
     * searchResultsSelectedCount is passed along to deletion-bulk-operations in the HTML
     * via [searchResultsSelectedCount]="searchResultsSelectedCount"
     * @param e
     */
    onResultsSelectCountUpdate( e ) {
       this.searchResultsSelectedCount = e;
    }

    getCollectionSite() {
        for( let row of this.currentQueryData ){
            if( row['criteria'] === Consts.QUERY_CRITERIA_COLLECTION ){
                return row['data'];
            }
        }
        return '';
    }

    // Run the query
    doApproveDeletionsSearch() {
        this.apiService.doCriteriaSearchQuery(
            Consts.TOOL_APPROVE_DELETIONS,
            this.currentQueryData
        );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
