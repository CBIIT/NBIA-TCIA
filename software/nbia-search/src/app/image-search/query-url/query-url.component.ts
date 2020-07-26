import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { HistoryLogService } from '@app/common/services/history-log.service';
import { Consts } from '@app/consts';
import { ParameterService } from '@app/common/services/parameter.service';
import { MenuService } from '@app/common/services/menu.service';
import { Properties } from '@assets/properties';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component( {
    selector: 'nbia-query-url',
    templateUrl: './query-url.component.html',
    styleUrls: ['./query-url.component.scss']
} )

/**
 * Generate the URL string that is presented when user selects Share My Query.
 */
export class QueryUrlComponent implements OnInit, OnDestroy{

    /**
     * The text of the full URL.
     */
    displayUrl;

    /**
     * The flag to show or hide this dialog box.
     * @type {boolean}
     */
    showQueryUrl = false;

    texSearchText = '';

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private queryUrlService: QueryUrlService,
                 private apiServerService: ApiServerService, private historyLogService: HistoryLogService,
                 private menuService: MenuService ) {
    }

    ngOnInit() {

        // To know what the Text query is we can subscribe to updateTextSearchQueryForDisplayEmitter,
        // it will update each time the Text search "Search" button is clicked.
        this.commonService.updateTextSearchQueryForDisplayEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.texSearchText = <string>data;
            }
        );

        // Tells us when the Header components "Share" -> "Share my query" menu item has been selected
        this.commonService.showQueryUrlEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            () => {
                this.menuService.lockMenu();

                if( this.commonService.getResultsDisplayMode() === Consts.TEXT_SEARCH ){
                    this.showQueryUrl = true;
                    this.displayUrl = location.href.toString() + '?' + Properties.URL_KEY_TEXT_SEARCH + '=' + encodeURI( this.texSearchText ).replace( /&/g, '%26' ).replace( /\?/g, '%3f' ).replace( /=/g, '%3d' );
                }
                else if( this.commonService.getResultsDisplayMode() === Consts.SIMPLE_SEARCH ){
                    this.showQueryUrl = true;

                    // this.displayUrl = location.origin.toString() + '?' + this.queryUrlService.getQueryUrl();
                    this.displayUrl = this.queryUrlService.getQueryUrl();

                    this.apiServerService.log( this.historyLogService.doLog( Consts.SHARE_QUERY_LOG_TEXT, this.apiServerService.getCurrentUser(),
                        this.queryUrlService.getQueryForLogging() ) );
                }
                else{
                    console.error( 'Got unknown search typ in QueryUrlComponent' );
                }
            }
        );
    }

    onCloseClick() {
        this.showQueryUrl = false;
        this.menuService.unlockMenu();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
