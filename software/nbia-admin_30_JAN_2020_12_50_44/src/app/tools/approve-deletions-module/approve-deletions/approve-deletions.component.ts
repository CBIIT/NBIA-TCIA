import { Component, OnInit } from '@angular/core';
import { Consts } from '../../../constants';
import { ApiService } from '../../../admin-common/services/api.service';
import { UtilService } from '../../../admin-common/services/util.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuerySectionService } from '../../query-section-module/services/query-section.service';
import { LoginService } from '../../../login/login.service';


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
            console.log('MHL 0 0this.userRoles: ', this.userRoles);
            console.log('MHL 101 getUserRoles: ', this.userRoles);
            this.userRoles = this.apiService.getUserRoles();
            if( this.userRoles !== undefined && this.userRoles.indexOf( 'NCIA.SUPER_CURATOR' ) > -1 ){
                console.log('MHL 01 this.userRoles: ', this.userRoles);
                this.roleIsGood = true;
            }
            console.log('MHL 02 this.userRoles: ', this.userRoles);

            await this.utilService.sleep( Consts.waitTime );
        }

            this.querySectionService.updatedQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                console.log('MHL ApproveDeletionsComponent.ngOnInit data: ', data);
                this.currentQueryData = data;
                this.doApproveDeletionsSearch();
            } );


    }

    // Run the query
    doApproveDeletionsSearch() {
        console.log('MHL IN doApproveDeletionsSearch **************************');
        this.apiService.approveDeletionsQuery(this.currentQueryData);

    }

}
