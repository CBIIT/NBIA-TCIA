import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Properties } from '@assets/properties';

import { Subject } from 'rxjs';
import { MenuService } from '@app/common/services/menu.service';

@Component( {
    selector: 'nbia-missing-criteria',
    templateUrl: './missing-criteria.component.html',
    styleUrls: ['./missing-criteria.component.scss']
} )
export class MissingCriteriaComponent implements OnInit, OnDestroy{

    showMissingCriteria = true;
    displayText = [];

    suggestLoggingIn: boolean;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiServerService: ApiServerService, private commonService: CommonService,
                 private menuService: MenuService) {
    }

    ngOnInit() {

        this.commonService.missingCriteriaEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {

                this.displayText = <any>data;

                // If there are criteria in query that can not be found,
                // suggest logging in if they logged in as the guest user (Properties.API_SERVER_USER_DEFAULT).
                if( this.apiServerService.getCurrentUser() === Properties.API_SERVER_USER_DEFAULT ){
                    this.suggestLoggingIn = true;
                }
                else{
                    this.suggestLoggingIn = false;
                }
                if( this.displayText.length > 0 ){
                    this.commonService.hideDataSection();
                }
            }
        )
    }


    onCloseClick() {
        this.displayText = [];
        this.commonService.clearMissingCriteriaArray();
        this.commonService.showDataSection();
    }

    onLoginClick(){
        this.commonService.clearMissingCriteriaArray();
        this.commonService.showDataSection();
        this.menuService.setCurrentItem(1);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
