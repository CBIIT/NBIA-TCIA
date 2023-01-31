import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { Properties } from '@assets/properties';
import { MenuService } from '@app/common/services/menu.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {DownloadTools} from "@app/consts";
import {DownloadDownloaderService} from "@app/cart/downloader-download/download-downloader.service";

@Component( {
    selector: 'nbia-downloader-download',
    templateUrl: './downloader-download.component.html',
    styleUrls: ['./downloader-download.component.scss', '../cart.component.scss', '../../app.component.scss']
} )

export class DownloaderDownloadComponent implements OnInit, OnDestroy{
    downLoadTool;

    /**
     * We only show this popup (set showDownloaderDownload = true) if downloaderDownLoadEmitter emits.
     * @type {boolean}
     */
    showDownloaderDownload = false;

    /**
     * tciaDownloaderUrl = 'https://wiki.cancerimagingarchive.net/display/NBIA/TCIA+Current+Help+Topics#TCIACurrentHelpTopics-DownloadingTCIAImages'
     * @type {string}
     */
    tciaDownloaderUrl;

    /**
     * If true, popup this popup.
     * @type {boolean}
     */
    showTciaDownloaderButton = true;

    properties = Properties;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private persistenceService: PersistenceService,
                 private menuService: MenuService, private downloadDownloaderService: DownloadDownloaderService ) {
    }

    ngOnInit() {

        // The cart download button has been clicked (no longer just for cart, @TODO rename things)
        this.commonService.downloaderDownLoadEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            ( data ) => {
                this.downLoadTool = data;
                this.showDownloaderDownload = true;
                this.menuService.lockMenu();
            }
        );
    }

    /**
     * "Cancel" button
     */
    onCancelCartDownloadClick() {
        this.showDownloaderDownload = false;
        this.menuService.unlockMenu();

        // Make sure the TciaDownloader download button is visible next time.
        this.showTciaDownloaderButton = true;

        // For cancel, we should make sure the popup pops up next time
        this.persistenceService.put( this.persistenceService.Field.SHOW_DOWNLOADER_DOWNLOAD, true );
    }

    /**
     * "Continue Cart Download" button
     * For Cart we can run it here for search query & text query we will emit
     */
    onContinueCartDownloadClick() {
        console.log('MHL onContinueCartDownloadClick 01 downLoadTool: ', this.downLoadTool);

        switch( this.downLoadTool ){
            case DownloadTools.CART:
                this.commonService.cartListDownLoadButton(DownloadTools.CART);
                this.showDownloaderDownload = false;

                // Unlock the menu as soon as the download dialog is displayed.
                this.menuService.unlockMenu();

                // Make sure the TciaDownloader download button is visible next time.
                this.showTciaDownloaderButton = true;

                break;

            case DownloadTools.SEARCH_QUERY:
                this.downloadDownloaderService.doDownload(DownloadTools.SEARCH_QUERY);
                this.menuService.unlockMenu();
                this.showDownloaderDownload = false;
                break;

            case DownloadTools.TEXT_QUERY:
                this.downloadDownloaderService.doDownload(DownloadTools.TEXT_QUERY);
                this.menuService.unlockMenu();
                this.showDownloaderDownload = false;
                break;

        }

    }

    /**
     * No longer show "Get TCIA Downloader" button.
     * This is called when the user clicks the "Get TCIA Downloader" button. The HTML launches a new tab with the site to get the Downloader.
     */
    onTciaDownloaderClick() {
        this.showTciaDownloaderButton = false;
    }

    /**
     * Checkbox for "Do not show this message again"
     * @param val  Checked  true or false.
     */
    onShowMessageCheckboxClick( val ) {
        // We save "NOT", because the checkbox is "Do not show this message again.".
        this.persistenceService.put( this.persistenceService.Field.SHOW_DOWNLOADER_DOWNLOAD, !val );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
