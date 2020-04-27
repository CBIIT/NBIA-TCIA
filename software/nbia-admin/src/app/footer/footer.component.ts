import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Properties } from '@assets/properties';
import { Subject } from 'rxjs';
import { ApiService } from '@app/admin-common/services/api.service';
import { Consts } from '@app/constants';

@Component( {
    selector: 'nbia-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class FooterComponent implements OnInit{

    properties = Properties;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService  ) {
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
    }

}
