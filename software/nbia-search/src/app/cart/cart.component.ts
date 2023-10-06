import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '@app/common/services/cart.service';
import { MenuService } from '@app/common/services/menu.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { CommonService } from '@app/image-search/services/common.service';
import {Consts, DownloadTools, MenuItems} from '@app/consts';
import { CartSortService } from '@app/cart/cart-sort.service';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';
import { UtilService } from '@app/common/services/util.service';
import { AlertBoxService } from '@app/common/components/alert-box/alert-box.service';
import { AlertBoxButtonType, AlertBoxType } from '@app/common/components/alert-box/alert-box-consts';
import { ParameterService } from '@app/common/services/parameter.service';
import { HistoryLogService } from '@app/common/services/history-log.service';

import { Subject } from 'rxjs';
import { takeUntil, timeout } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Properties } from '@assets/properties';
import { PersistenceService } from '@app/common/services/persistence.service';

@Component( {
    selector: 'nbia-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['../app.component.scss', './cart.component.scss']
} )

/**
 * The cart list screen, launched when the top main menu "Cart" button is clicked. The "Cart" menu button is only enabled if there is anything in the cart.
 */
export class CartComponent implements OnInit, OnDestroy{
    /**
     * The list used to do the download, not the display. It can have disabled entries, which will not be used in the download.
     * @type {Array}
     */
    cart = [];

    /**
     * The list (with the disabled ones), this is used to make the Rest call for all the series data for the Cart screen.
     * @type {string}
     */
    seriesListForQuery = '';

    /**
     * The list without the disabled ones, this is used to make the Rest call for the download.
     * @type {string}
     */
    seriesListForDownloadQuery = '';

    /**
     * Used to collect list of series for the display.
     * @type {Array}
     */
    cartList = [];

    // If all cart entries are disabled, disable the download button
    allDisabled = true;

    excludeCommercialFlag = false;
    excludeCommercialCount = 0;
    showExcludeCommercialWarning = false;
    showExcludeCommercialWarningPref = false;
    alertId01 = 'nbia-cart-01';
    alertBoxResults = null;

    /**
     * The column headings. The first element "X" is just a place holder, the HTML displays a cart button with a red X on it.
     * @type {[string , string , string , string , string , string , string , string , string , string]}
     */
    columnHeadings = ['X', 'Collection', 'Subject ID', 'Study UID', 'Study Date', 'Study Description', 'Series ID', 'Series Description', 'Images', 'File Size', 'Annotation File Size'];


    columns = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Rows to display, combine pager and perPage
    firstRow: number;
    lastRow: number;
    rowsPerPage: number;
    currentPage: number;

    /**
     * For the busy/working/loading warning.  @TODO still a work in progress.
     * @type {boolean}
     */
    busy = false;

    properties = Properties;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private cartService: CartService, private menuService: MenuService,
                 private apiServerService: ApiServerService, private commonService: CommonService,
                 public sortService: CartSortService, private loadingDisplayService: LoadingDisplayService,
                 private alertBoxService: AlertBoxService, private parameterService: ParameterService,
                 private historyLogService: HistoryLogService, private utilService: UtilService,
                 private httpClient: HttpClient, private persistenceService: PersistenceService ) {
    }


    ngOnInit() {

        this.showExcludeCommercialWarningPref = (!this.persistenceService.get( this.persistenceService.Field.NO_COMMERCIAL_RESTRICTION_WARNING ));
        // Called when a Series is added to the cart or disabled/enabled
        // Called by
        //     CartService.cartAdd
        //     CartService.cartDelete
        //     CartService.clearCart
        this.cartService.cartChangeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.cart = <any>data;
                this.updateCartList();
            }
        );

        this.cartService.cartClearEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.cartList = [];
            }
        );


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // When the cart menu is clicked in the top right of the nav bar or a shared list was passed in the URL
        this.menuService.currentMenuItemEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( data === MenuItems.CART_MENU_ITEM ){
                    //  @CHECKME this.cartList = [];

                    // If this was run due to a Shared list in the URL, we need to get the list of services from the API service.
                    if( this.parameterService.haveUrlSharedList() === this.parameterService.yes ){
                        this.loadingDisplayService.setLoading( true, 'Retrieving data' );

                        // Get the data for this list of series
                        this.apiServerService.doSearch( Consts.GET_SHARED_LIST, 'nameValue=' + this.parameterService.getSharedListName() );
                    }else{
                        this.loadingDisplayService.setLoading( true, 'Updating Cart' );
                        this.apiServerService.doSearch( Consts.DRILL_DOWN_CART, this.seriesListForQuery );
                    }
                }
            }
        );
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.apiServerService.getSharedListResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                // We now have the list of series
                let seriesList = '';
                if( (!this.utilService.isNullOrUndefined( data )) && (!this.utilService.isNullOrUndefined( data['seriesInstanceUIDs'] )) ){
                    for( let series of data['seriesInstanceUIDs'] ){
                        seriesList += '&list=' + series;
                    }
                    // Remove leading &
                    seriesList = seriesList.substr( 1 );
                    this.apiServerService.doSearch( Consts.DRILL_DOWN_CART_FROM_SERIES, seriesList );
                }else{
                    console.error( 'getSharedListResultsEmitter.subscribe data: ', data );
                }

                this.loadingDisplayService.setLoading( false );

            }
        );
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // When the alert box has closed (and returned results) store the results, and enable the menu.
        this.alertBoxService.alertBoxReturnEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( data['id'] === this.alertId01 ){
                    this.alertBoxResults = data['button'];
                }
            }
        );


        // Gets subjects, adds their series to cartList.
        //
        // Adds to the series:
        //   studyDate
        //   studyDescription
        this.apiServerService.seriesForCartResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async data => {
                this.excludeCommercialCount = 0;
                this.excludeCommercialFlag = false;
                this.showExcludeCommercialWarning = false;

                for( let item of <any>data ){

                    if( this.showExcludeCommercialWarningPref ){
                        if(
                            (!Properties.NO_LICENSE) &&
                            ((!this.utilService.isNullOrUndefinedOrEmpty( item['excludeCommercial'] )) && (this.utilService.isTrue( item['excludeCommercial'] )))
                        ){
                            this.excludeCommercialFlag = (item['excludeCommercial'] === null) ? false : this.utilService.isTrue( item['excludeCommercial'] );
                            this.showExcludeCommercialWarning = this.excludeCommercialFlag;
                            this.excludeCommercialCount += item['seriesList'].length;
                        }
                    }

                    for( let series of item.seriesList ){
                        if( !Properties.NO_LICENSE ){
                            series['exCom'] = (!this.utilService.isNullOrUndefinedOrEmpty( item['excludeCommercial'] )) && (this.utilService.isTrue( item['excludeCommercial'] ));
                        }
                        series['studyDate'] = item.date;
                        series['studyDescription'] = item.description;
                        this.addSeriesToCartList( series );
                    }
                }
                this.commonService.updateCartCount( this.cartList.length );
                this.sortService.doSort( this.cartList );
                this.busy = false;

                this.loadingDisplayService.setLoading( false );
            }
        );


        this.apiServerService.seriesForCartResultsErrorEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            err => {
                console.error( 'CartComponent seriesForCartResultsErrorEmitter.subscribe: ', err );
                this.loadingDisplayService.setLoading( false );
            }
        );
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


        // Gets subjects, adds their series to cartList.
        //
        // Adds to the series:
        //   formattedStudyDate - This date is for display.
        //   studyDate - This date is for sorting.
        //   studyDescription
        this.apiServerService.seriesForCartFromSeriesIdResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                for( let item of <any>data ){
                    for( let series of item.seriesList ){
                        // This date is for display
                        series['formattedStudyDate'] = new Date( item.date );

                        // This date is for sorting
                        series['studyDate'] = item.date;
                        series['studyDescription'] = item.description;
                        this.addSeriesToCartList( series );

                        if( this.parameterService.haveUrlSharedList() === this.parameterService.yes ){
                            this.cartService.cartAdd( series.seriesUID, series.studyId, series.subjectId, series.seriesPkId, '', series.exactSize );
                        }

                    }
                }

                // FIXME - is there a better place to set this
                // Set this so we don't reload the URL shared list each time user clicks the top menu Cart button.
                if( this.parameterService.haveUrlSharedList() === this.parameterService.yes ){
                    this.parameterService.seenUrlSharedList();
                }

                this.sortService.doSort( this.cartList );
                this.commonService.updateCartCount( this.cartList.length );

                this.busy = false;
                this.loadingDisplayService.setLoading( false );
            }
        );
        this.apiServerService.seriesForCartFromSeriesIdErrorEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            err => {
                console.error( 'CartComponent seriesForCartResultsErrorEmitter.subscribe: ', err );
                this.loadingDisplayService.setLoading( false );
            }
        );


        // Get number of rows to display  (per page)
        this.commonService.cartsPerPageEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.rowsPerPage = <number>data;
                this.lastRow = Number( this.firstRow ) + Number( this.rowsPerPage ) - 1;
            } );


        // Get current page number
        this.commonService.cartPageEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentPage = <number>data;
                this.firstRow = this.rowsPerPage * this.currentPage;
                this.lastRow = this.firstRow + (+this.rowsPerPage - 1);
            } );


        // Save the cart as a shared list
        // called by commonService.sharedListDoSave
        this.commonService.sharedListSaveFromCartEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.buildSeriesList();

                let query = this.seriesListForDownloadQuery + '&name=' + data['name'];

                if( !this.utilService.isNullOrUndefined( data['description'] ) ){
                    query += '&description=' + data['description'];

                }
                if( !this.utilService.isNullOrUndefined( data['url'] ) ){
                    query += '&url=' + data['url'];

                }
                this.apiServerService.doSearch( Consts.CREATE_SHARED_LIST, query );

            }
        );


        this.commonService.downloadCartAsCsvEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                let query = 'list=';

                let first = true;
                for( let series of <any>data ){
                    if( !series.disabled ){
                        if( first ){
                            first = false;
                        }else{
                            query += ',';
                        }
                        query += series.seriesId;
                    }
                }

                if( Properties.DEBUG_CURL ){
                    let curl = 'curl -O -H \'Authorization:Bearer  ' + this.apiServerService.showToken() + '\' -k \'' + Properties.API_SERVER_URL + '/nbia-api/services/getSeriesMetadata2' + '\' -d \'' + query + '\'';
                    console.log( 'downloadCartAsCsv: ', curl );
                }

                let csvDownloadUrl = Properties.API_SERVER_URL + '/nbia-api/services/getSeriesMetadata2';

                let headers = new HttpHeaders( {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + this.apiServerService.showToken()
                } );

                let options = { headers: headers, responseType: 'text' as 'json' };

                this.httpClient.post( csvDownloadUrl, query, options ).pipe( timeout( Properties.HTTP_TIMEOUT ) ).subscribe(
                    ( res ) => {
                        let csvFile = new Blob( [<any>res], { type: 'text/csv' } );
                        // TODO in the manifest download popup, it says 'from: blob:'  see if we can change this.
                        let objectUrl = (<any>window).URL.createObjectURL( csvFile );
                        let a = (<any>window).document.createElement( 'a' );
                        a.href = objectUrl;
                        // Use epoch for unique file name
                        a.download = 'series-data' + new Date().getTime() + '.csv';
                        (<any>window).document.body.appendChild( a );
                        a.click();
                        (<any>window).document.body.removeChild( a );
                    }, error => {
                        console.error( 'Download csv file error:', error );
                    }
                );

                ///////////////////////////////////////////////////////////////////////////////

            }
        );


        // Called by CartButtonGroupComponent.onDownloadClick() -> CommonService.cartListDownLoadButton()
        // Creates and downloads a manifest file named NBIA-manifest-<EPOCH>.tcia
        this.commonService.cartListDownLoadEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                if( data !== DownloadTools.CART){
                    // Need to use this emitter for text and query downloads now also
                    return;
                }
                this.buildSeriesList();

                // Send to log
                let logData = this.historyLogService.doLog( Consts.DOWNLOAD_CART_LOG_TEXT, this.apiServerService.getCurrentUser(), this.cartList );
                this.apiServerService.log( logData );


                // Call Rest service to generate the '.tcia download manifest file.
                this.apiServerService.downloadSeriesList( this.seriesListForDownloadQuery ).subscribe(
                    data_inner => {
                        let databasketId = data_inner.match(/databasketId=(.*)/);
                        if( databasketId[1] === undefined ){
                            console.error('Error can not get databasketId from manifest data.');
                        }
                        let tciaManifestFile = new Blob( [data_inner], { type: 'application/x-nbia-manifest-file' } );

                        //  This worked, but I could not figure out how to set the file name.
                        // let url= (<any>window).URL.createObjectURL(tciaManifestFile);
                        // (<any>window).open(url);

                        // This works
                        // TODO in the manifest download popup, it says 'from: blob:'  see if we can change this.
                        let objectUrl = (<any>window).URL.createObjectURL( tciaManifestFile );
                        let a = (<any>window).document.createElement( 'a' );
                        a.href = objectUrl;
                        // Use epoch for unique file name
                        a.download = databasketId[1];
                        (<any>window).document.body.appendChild( a );
                        a.click();
                        (<any>window).document.body.removeChild( a );

                    },
                    err => {
                        console.error( 'Error downloading cart/manifest: ', err );

                        let text = [];
                        text.push( err['statusText'] + ' - ' + err['status'] );
                        text.push( err['_body'] );
                        // text.push( err['url'] );
                        this.alertBoxService.alertBoxDisplay( 0,
                            AlertBoxType.ERROR,
                            'Error downloading Series data!',
                            text,
                            AlertBoxButtonType.OKAY
                        );
                    }
                );
            }
        );
        this.sortService.initSortState( this.columns );
    }


    buildSeriesList() {
        this.seriesListForDownloadQuery = '';
        let len = this.cart.length;
        // Loop through list of Cart entries.
        for( let f = 0; f < len; f++ ){
            if( !this.cart[f].disabled ){
                this.seriesListForDownloadQuery += '&list=' + this.cart[f].id;
            }
        }

        // Remove leading &
        this.seriesListForDownloadQuery = this.seriesListForDownloadQuery.substr( 1 );

    }

    done() {
        this.loadingDisplayService.setLoadingOff();
    }


    /**
     * Update the sort state for column i then (Re)sort cart contents.
     * @param i
     */
    onHeadingClick( i ) {
        this.loadingDisplayService.setLoading( true, 'Sorting Cart' );

        this.sortService.updateCartSortState( i );
        this.sortService.doSort( this.cartList );
        this.loadingDisplayService.setLoading( false );

    }

    addSeriesToCartList( series ) {
        // See if it is already in the list
        let len = this.cartList.length;
        for( let f = 0; f < len; f++ ){
            if( this.cartList[f].seriesUID === series.seriesUID ){
                return;
            }
        }
        this.cartList.push( series );
    }

    disableCommercialSeries() {
        let len = this.cartList.length;
        for( let f = 0; f < len; f++ ){
            this.cartList[f].disabled = this.cartList[f].exCom;
        }
        this.updateCartList();
    }

    reEnableAllSeries() {
        let len = this.cartList.length;
        for( let f = 0; f < len; f++ ){
            this.cartList[f].disabled = false;
        }
        this.updateCartList();
    }

    /**
     * Updates this.seriesListForQuery and this.seriesListForDownloadQuery Series list formatted for the Rest call.
     * @CHECKME
     */
    updateCartList() {
        // Query used for download
        this.seriesListForQuery = '';
        this.seriesListForDownloadQuery = '';
        let len = this.cart.length;
        this.allDisabled = true;
        for( let f = 0; f < len; f++ ){

            // TODO refactor this when time permits
            if(( this.cartList[f] !== undefined) ){
                this.cart[f].disabled = this.cartList[f].disabled;
            }

            if(!this.cart[f].disabled){
                this.seriesListForDownloadQuery += '&list=' + this.cart[f].seriesPkId;
                this.allDisabled = false;
            }
            this.seriesListForQuery += '&list=' + this.cart[f].seriesPkId;
        }

        // Remove leading &
        this.seriesListForQuery = this.seriesListForQuery.substr( 1 );
        this.seriesListForDownloadQuery = this.seriesListForDownloadQuery.substr( 1 );
    }


    /**
     * Called when a Cart button is clicked.
     *
     * @param i The index number for this Cart item.
     */
    onCartCheckClick( i ) {

        this.cartList[i].disabled = !this.cartList[i].disabled;
        this.cart[i].disabled = this.cartList[i].disabled;

        this.updateCartList();
        this.cartService.setCartEnableCartById( this.cart[i].id, !this.cart[i].disabled );
    }


    onProceedClick() {
        this.reEnableAllSeries();
        this.showExcludeCommercialWarning = false;
    }

    onDisableCommercialSeriesClick() {
        this.disableCommercialSeries();
        this.showExcludeCommercialWarning = false;
    }

    onExcludeCommercialCheckboxClick( state ) {
        this.persistenceService.put( this.persistenceService.Field.NO_COMMERCIAL_RESTRICTION_WARNING, state );
        this.showExcludeCommercialWarningPref = (!state);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
