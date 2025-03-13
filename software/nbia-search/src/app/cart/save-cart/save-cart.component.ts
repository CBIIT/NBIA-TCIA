import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { NgForm } from '@angular/forms';
import { MenuService } from '@app/common/services/menu.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Consts } from '@app/consts';
import { Properties } from '@assets/properties';
import { HistoryLogService } from '@app/common/services/history-log.service';
import { ClipboardModule} from '@angular/cdk/clipboard';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-save-cart',
    templateUrl: './save-cart.component.html',
    styleUrls: ['./save-cart.component.scss'],
    imports: [ClipboardModule]
} )
export class SaveCartComponent implements OnInit, OnDestroy{

    showSaveCartUrl = false;
    displayUrl = 'Waiting for URL con...';
    saveCartName = '';

    NONE = -1;
    WAITING = 0;
    GOOD = 1;
    BAD = 2;
    DUPE = 3;
    status = this.NONE;
    isSaving = false; // For the spinner

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private menuService: MenuService,
                 private apiServerService: ApiServerService, private historyLogService: HistoryLogService ) {
    }

    ngOnInit() {
        this.commonService.saveMyCartPopupEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.menuService.lockMenu();
                this.saveSharedListFromCart();
                this.showSaveCartUrl = true;
            }
        );


        this.apiServerService.saveSharedListResultsEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
           () => { this.onSaveSuccess(); }
        );

        this.apiServerService.saveSharedListErrorEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
           err => { this.onSaveError(err); }
        );  


    }

    createName() {
        return 'nbia-' + Math.floor( Math.random() * 10000 ) + new Date().valueOf();
    }

    async saveSharedListFromCart() {
        this.status = this.WAITING;
        this.isSaving = true;
        this.displayUrl = "⏳ Saving cart, please wait ..."; // Initial status
        this.saveCartName = this.createName();
        this.commonService.sharedListDoSave( this.saveCartName, 'sharedList:' + this.saveCartName, '' );

        while (this.status === this.WAITING) {
            await this.delay(500); // Simulate waiting for backend
        }

        // while( this.status === this.WAITING ){
        //     await this.commonService.sleep( Consts.waitTime );
        // }

        // if( this.status === this.GOOD ){
        //     this.displayUrl = location.href.toString().replace( /\?.*/, '' ) + '?' + Properties.URL_KEY_SHARED_LIST + '=' + name;

        //     this.status = this.NONE;
        //     this.apiServerService.log( this.historyLogService.doLog( Consts.SAVE_CART_LOG_TEXT, this.apiServerService.getCurrentUser(), name ) );

        // }
        // else if( this.status === this.BAD ){
        //     alert( 'Error saving Cart.' ); // TODO
        //     this.status = this.NONE;
        // }
    }

    onSaveSuccess() {
        this.isSaving = false;
        this.displayUrl = `${location.href.toString().replace(/\?.*/, '')}?${Properties.URL_KEY_SHARED_LIST}=${this.saveCartName}`;
        this.status = this.NONE;
        this.apiServerService.log( this.historyLogService.doLog( Consts.SAVE_CART_LOG_TEXT, this.apiServerService.getCurrentUser(), this.saveCartName));
    }

    onSaveError(err: any) {
        this.isSaving = false;
        this.displayUrl = "❌ Error saving cart. Please try again.";
        console.error('Save error:', err);
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
