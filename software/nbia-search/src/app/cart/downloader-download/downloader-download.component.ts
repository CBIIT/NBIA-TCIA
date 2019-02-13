import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { Properties } from '@assets/properties';
import { MenuService } from '@app/common/services/menu.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-downloader-download',
    templateUrl: './downloader-download.component.html',
    styleUrls: ['./downloader-download.component.scss', '../cart.component.scss', '../../app.component.scss']
} )

export class DownloaderDownloadComponent implements OnInit, OnDestroy{

    /**
     * We only show this popup (set showDownloaderDownload = true) if downloaderDownLoadEmitter emits.
     * @type {boolean}
     */
    showDownloaderDownload = false;

    /**
     * tciaDownloaderUrl = 'https://wiki.cancerimagingarchive.net/display/NBIA/TCIA+Current+Help+Topics#TCIACurrentHelpTopics-DownloadingTCIAImages'
     * @type {string}
     */
    tciaDownloaderUrl = Properties.TCIA_DOWNLOADER_URL;

    /**
     * If true, popup this popup.
     * @type {boolean}
     */
    showTciaDownloaderButton = true;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private persistenceService: PersistenceService,
                 private menuService: MenuService ) {
    }

    ngOnInit() {

        // The cart download button has been clicked
        this.commonService.downloaderDownLoadEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            () => {
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
     */
    onContinueCartDownloadClick() {
        this.commonService.cartListDownLoadButton();
        this.showDownloaderDownload = false;

        // Unlock the menu as soon as the download dialog is displayed.
        this.menuService.unlockMenu();

        // Make sure the TciaDownloader download button is visible next time.
        this.showTciaDownloaderButton = true;
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
