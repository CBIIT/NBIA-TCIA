import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Properties } from '@assets/properties';
import { Subject } from 'rxjs';
import { ApiService } from '@app/admin-common/services/api.service';
import { Consts } from '@app/constants';
import { takeUntil } from 'rxjs/operators';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';
import { UtilService } from '@app/admin-common/services/util.service';

@Component( {
    selector: 'nbia-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class FooterComponent implements OnInit, OnDestroy{
    userRoles;
    userRolesCount = 0;
    user;
    rolesHeadingText = 'User role(s):';

    properties = Properties;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService, private accessTokenService: AccessTokenService,
                 private utilService: UtilService ) {
    }

    ngOnInit() {


        this.apiService.doGetNoToken( Consts.GET_HOST_NAME ).subscribe(
            data => {
                Properties.HOST_NAME = <string>data;
            },
            error => {
                Properties.HOST_NAME = 'Unknown';
                console.error( 'Error getting host name: ', error );
            } );

        this.apiService.updatedUserRolesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.userRoles = data;
                this.userRolesCount = this.userRoles.length;
            } );

        this.user = this.accessTokenService.getCurrentUser();
        if( !this.utilService.isNullOrUndefinedOrEmpty( this.user ) ){
            this.rolesHeadingText = 'User role(s) for ' + this.user + ':';
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
