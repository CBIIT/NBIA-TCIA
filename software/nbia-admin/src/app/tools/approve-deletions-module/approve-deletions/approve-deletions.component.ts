import { Component, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuerySectionService } from '../../query-section-module/services/query-section.service';
import { LoginService } from '@app/login/login.service';


@Component( {
    selector: 'nbia-approve-deletions',
    templateUrl: './approve-deletions.component.html',
    styleUrls: ['./approve-deletions.component.scss']
} )

export class ApproveDeletionsComponent implements OnInit{
    consts = Consts;
    userRoles;
    roleIsGood = false;
    currentQueryData = [];
    searchResults = {};
    searchResultsSelectedCount = 0;
    collectionSite = '';
    showBulkOperations = false;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService, private utilService: UtilService,
                 private querySectionService: QuerySectionService, private loginService: LoginService ) {
    }

    async ngOnInit() {
        // make sure we are not ahead of apiService initialization.


        this.apiService.updatedUserRolesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.userRoles = data;
                if( this.userRoles !== undefined && this.userRoles.indexOf( 'NCIA.SUPER_CURATOR' ) > -1 ){
                    this.roleIsGood = true;
                }
            });
        this.apiService.getRoles();


        this.querySectionService.updatedQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentQueryData = data;
                this.collectionSite = this.getCollectionSite();
                this.doApproveDeletionsSearch();
            } );


        /**
         * Check for search results.  If there are none, don't show bulk operations.
         */
        this.apiService.searchResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showBulkOperations = data[0] !== Consts.NO_SEARCH && data.length > 0;
            } );

    }

    onSearchResultsUpdate( e ) {
        if( !this.utilService.isNullOrUndefinedOrEmpty( e ) ){
            this.searchResults = e;
        }
    }

    onResultsSelectCountUpdate( e ) {
        this.searchResultsSelectedCount = e;
    }

    getCollectionSite(){
        for( let row of this.currentQueryData){
            if( row['criteria'] === Consts.QUERY_CRITERIA_COLLECTION){
                return row['data'];
            }
        }
        return '';
    }

    // Run the query
    doApproveDeletionsSearch() {
        this.apiService.doCriteriaSearchQuery( Consts.TOOL_APPROVE_DELETIONS,  this.currentQueryData);

    }

}
