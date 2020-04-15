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

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService, private utilService: UtilService,
                 private querySectionService: QuerySectionService, private loginService: LoginService ) {
    }

    async ngOnInit() {
        // make sure we are not ahead of apiService initialization.
        while( this.userRoles === undefined ){
            this.userRoles = this.apiService.getUserRoles();
            if( this.userRoles !== undefined && this.userRoles.indexOf( 'NCIA.SUPER_CURATOR' ) > -1 ){
                this.roleIsGood = true;
            }
            await this.utilService.sleep( Consts.waitTime );
        }

            this.querySectionService.updatedQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentQueryData = data;
                this.doApproveDeletionsSearch();
            } );


    }

    // Run the query
    doApproveDeletionsSearch() {
        this.apiService.doCriteriaSearchQuery( Consts.TOOL_APPROVE_DELETIONS,  this.currentQueryData);

    }

}
