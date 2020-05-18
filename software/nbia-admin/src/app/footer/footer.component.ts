import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Properties } from '@assets/properties';
import { Subject } from 'rxjs';
import { ApiService } from '@app/admin-common/services/api.service';
import { Consts } from '@app/constants';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';

@Component( {
    selector: 'nbia-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class FooterComponent implements OnInit{
    userRoles;
    user;


    properties = Properties;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService, private accessTokenService: AccessTokenService  ) {
    }

    ngOnInit() {


        this.apiService.doGetNoToken( Consts.GET_HOST_NAME ).subscribe(
            data => {
                Properties.HOST_NAME = <string>data;
            },
            error => {
                Properties.HOST_NAME = 'Unknown';
                console.error('Error getting host name: ', error);
            });

        this.apiService.updatedUserRolesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.userRoles = data;
            });

        this.user = this.accessTokenService.getCurrentUser();

    }

}
