import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Properties } from '@assets/properties';
import { Subject } from 'rxjs';
import { Consts } from '@app/consts';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class FooterComponent implements OnInit, OnDestroy{

    properties = Properties;
    userRoles;
    user;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiServerService: ApiServerService ) {
    }

    ngOnInit() {

        this.apiServerService.doGetNoToken( Consts.GET_HOST_NAME ).subscribe(
            data => {
                Properties.HOST_NAME = <string>data;
            },
            error => {
                Properties.HOST_NAME = 'Unknown';
                console.error( 'Error getting host name: ', error );
            } );

        this.apiServerService.currentUserRolesEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.userRoles = data;
            }
        );
        this.apiServerService.userSetEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.user = data;
            }
        );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
