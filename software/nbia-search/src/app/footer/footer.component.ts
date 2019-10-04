import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Properties } from '@assets/properties';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilService } from '@app/common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { Consts } from '@app/consts';
import { ApiServerService } from '@app/image-search/services/api-server.service';

@Component( {
    selector: 'nbia-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class FooterComponent implements OnInit{

    properties = Properties;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiServerService: ApiServerService  ) {
    }

    ngOnInit() {


        this.apiServerService.doGetNoToken( Consts.GET_HOST_NAME ).subscribe(
            data => {
                Properties.HOST_NAME = <string>data;
            },
            error => {
                Properties.HOST_NAME = 'Unknown';
                console.error('Error getting host name: ', error);
            });
    }

}
