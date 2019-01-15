import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Properties } from '@assets/properties';

import { Subject } from 'rxjs';


@Component( {
    selector: 'nbia-top-right-button-group',
    templateUrl: './top-right-button-group.component.html',
    styleUrls: ['./top-right-button-group.component.scss']
} )

export class TopRightButtonGroupComponent implements OnInit, OnDestroy{

    /**
     * Scroll style, false is the default.  The other style (scroll = true) is not working good yet.
     * @type {boolean}
     */
    scroll = false;

    /**
     * True if "Select Display Columns" popup is showing, false if not.
     */
    showSearchResultsColumnClickSelected;

    showDownloaderDownload;

    // For HTML access
    SHOW_SCROLL_STYLE_BUTTON = Properties.SHOW_SCROLL_STYLE_BUTTON;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService ) {
    }

    ngOnInit() {

        // True if "Select Display Columns" button is down, false if it is up.
        // Used to change the HTML class of the button to look dark/selected when true.
        this.commonService.showSearchResultsColumnEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.showSearchResultsColumnClickSelected = data;
            }
        );
    }


    /**
     * Show the popup of "Select Display Columns" with check boxes for the user to select, to see, or not.
     */
    onShowSearchResultsColumnClick() {
        this.commonService.showSearchResultsColumn();
    }

    /**
     * Changes the scroll style, false is the default.  The other style (scroll = true) is not working good yet.
     */
    onToggleScrollClick() {
        this.commonService.toggleSearchResultsScrolling();
        this.scroll = !this.scroll;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
