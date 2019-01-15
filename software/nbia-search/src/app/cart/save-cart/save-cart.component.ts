import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { NgForm } from '@angular/forms';
import { MenuService } from '@app/common/services/menu.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Consts } from '@app/consts';
import { Properties } from '@assets/properties';
import { HistoryLogService } from '@app/common/services/history-log.service';

import { Subject } from 'rxjs';

@Component( {
    selector: 'nbia-save-cart',
    templateUrl: './save-cart.component.html',
    styleUrls: ['./save-cart.component.scss']
} )
export class SaveCartComponent implements OnInit, OnDestroy{

    showSaveCartUrl = false;
    displayUrl = 'Waiting for URL con...';

    NONE = -1;
    WAITING = 0;
    GOOD = 1;
    BAD = 2;
    DUPE = 3;
    status = this.NONE;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private menuService: MenuService,
                 private apiServerService: ApiServerService, private historyLogService: HistoryLogService ) {
    }

    ngOnInit() {
        this.commonService.saveMyCartPopupEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.menuService.lockMenu();
                this.saveSharedListFromCart( this.createName() );
                this.showSaveCartUrl = true;
            }
        );


        this.apiServerService.saveSharedListResultsEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.status = this.GOOD;
            }
        );

        this.apiServerService.saveSharedListErrorEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            err => {

                // Is it an error because this List name is already being used?
                if( err['_body'] === 'Duplicate list name' ){
                    this.status = this.DUPE;
                }
                else{
                    this.status = this.BAD;
                    console.error( 'Save shared list ERROR: ', err['status'] );
                    console.error( 'Save shared list ERROR: ', err['_body'] );
                }
            }
        );


    }

    createName() {
        return 'nbia-' + Math.floor( Math.random() * 10000 ) + new Date().valueOf();
    }

    async saveSharedListFromCart( name ) {
        this.status = this.WAITING;
        this.commonService.sharedListDoSave( name, 'sharedList:' + name, '' );

        while( this.status === this.WAITING ){
            await this.commonService.sleep( Consts.waitTime );
        }

        if( this.status === this.GOOD ){
            this.displayUrl = location.href.toString().replace( /\?.*/, '' ) + '?' + Properties.URL_KEY_SHARED_LIST + '=' + name;

            this.status = this.NONE;
            this.apiServerService.log( this.historyLogService.doLog( Consts.SAVE_CART_LOG_TEXT, this.apiServerService.getCurrentUser(), name ) );

        }
        else if( this.status === this.BAD ){
            alert( 'Error saving Cart.' ); // TODO
            this.status = this.NONE;
        }
    }


    onCloseClick() {
        this.showSaveCartUrl = false;
        this.menuService.unlockMenu();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
