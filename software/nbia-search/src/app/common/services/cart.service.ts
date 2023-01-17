import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Consts } from '@app/consts';
import { UtilService } from '@app/common/services/util.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()

/**
 * This component maintains the Cart.
 */
export class CartService implements OnDestroy{
    cartChangeEmitter = new EventEmitter();
    cartCountEmitter = new EventEmitter();
    cartClearEmitter = new EventEmitter();
    cartCount = 0;


    /**
     * To be able to get cart status by Subject
     * 0 = none selected for cart, 1 some but not all, or 2 all selected for cart
     *
     * The index will be <subject>
     */
    cartStatus = [];

    private cart = [];

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private apiServerService: ApiServerService,
                 private utilService: UtilService ) {

        // When clicking on a "Cart" in the search results this.cartGetSeriesForSubject is called
        // A list of all the Studies (each having a list of all its series) for one subject is sent to this emitter.
        // Each series is then added to or deleted from the cart.
        this.apiServerService.seriesForSubjectResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                for( let row of data['res'] ){
                    for( let series of row.seriesList ){
                        if( data['selected'] ){
                            this.cartAdd( series.seriesUID, series.studyId, data['id'], series.seriesPkId, '', series.exactSize );
                        }else{
                            this.cartDelete( series.seriesUID );
                        }
                    }
                }
            }
        );

        this.apiServerService.seriesForSubjectErrorEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            err => {
                console.error( 'CartService seriesForSubjectErrorEmitter.subscribe: ', err );
            }
        );
    }

    /**
     * updates and emits the cart count and total size for the cart files
     */
    updateCartCount() {
        // Number of files excluding disabled.
        let count = 0;
        // Size of files excluding disabled.
        let fileSize = 0;
        // Size of files including disabled.
        let fullFileSize = 0;
        let len = this.cart.length;
        for( let f = 0; f < len; f++ ){
            fullFileSize += (+this.cart[f].size);
            if( !this.cart[f].disabled ){
                count++;
                fileSize += (+this.cart[f].size);
            }


        }

        this.cartCount = count;
        this.cartCountEmitter.emit( { count, fileSize, fullFileSize } );
    }


    getCartCount() {
        return this.cartCount;
    }

    /**
     *
     * @param id
     * @param state
     */
    setCartEnableCartById( id, state ) {
        for( let item of this.cart ){
            if( item.id === id ){
                item.disabled = !state;
            }
        }
        this.updateCartCount();
    }


    /**
     *
     * @param id
     */
    disableCartById( id ) {
        this.setCartEnableCartById( id, false );
    }


    /**
     *
     * @param id
     */
    enableCartById( id ) {
        this.setCartEnableCartById( id, true );
    }

    cartGetCartByStudy( studyId ) {
        let results = [];
        let len = this.cart.length;
        for( let f = 0; f < len; f++ ){
            if( this.cart[f].studyId === studyId ){
                results.push( this.cart[f] );
            }
        }
        return results;
    }


    /**
     * Gets a list of all series for a subject, so the subjectId cart button can check or uncheck all it's children's checkboxes.
     *
     * @param subjectId
     * @param studyIdentifiers
     * @param selected
     */
    cartGetSeriesForSubject( subjectId, studyIdentifiers, selected ) {
        // Build the query
        let query = '';
        for( let row of studyIdentifiers ){
            for( let f = 0; f < row.seriesIdentifiers.length; f++ ){
                query += '&list=' + row.seriesIdentifiers[f];
            }
        }
        // Remove leading &
        query = query.substr( 1 );

        // Run the query
        this.apiServerService.doSearch( Consts.SERIES_FOR_SUBJECT, query, subjectId, selected );
    }


    /**
     * Adds one series to the cart.
     *
     * @param {string} seriesId
     * @param studyId
     * @param subjectId
     * @param seriesPkId
     * @param seriesSize
     */
    cartAdd( seriesId: string, studyId, subjectId, seriesPkId, seriesInstanceUid, seriesSize ) {
        if( this.utilService.isNullOrUndefined( subjectId ) ){
            subjectId = '';
        }

        if( this.utilService.isNullOrUndefined( seriesPkId ) ){
            seriesPkId = '';
        }

        if( this.utilService.isNullOrUndefined( seriesInstanceUid ) ){
            seriesInstanceUid = '';
        }

        // If this Series is not already in the cart.
        if( !this.cartHas( seriesId ) ){
            this.cart.push(
                {
                    'id': seriesId,
                    'studyId': studyId,
                    'subjectId': subjectId,
                    'seriesPkId': seriesPkId,
                    'seriesInstanceUid': seriesInstanceUid,
                    'size': seriesSize,
                    'disabled': false
                }
            );

            // Subscribed to by CartComponent
            this.cartChangeEmitter.emit( this.cart );

            // Subscribed to by HeaderComponent for the little counter on top menu.
            this.updateCartCount();
        }
    }


    /**
     * Empties the cart
     */
    clearCart() {
        this.cart = [];
        this.cartChangeEmitter.emit( this.cart );

        // Subscribed to by HeaderComponent for the little counter on top menu.
        this.cartCountEmitter.emit( { 'count': 0, 'fileSize': 0 } );
        this.cartCount = 0;

        // Let the Search results & Subject details screens know to clear all Carts.
        this.cartClearEmitter.emit( true ); // This value is not used

        this.clearCartStatus();
    }

    /**
     * Removes one item from the cart.
     *
     * @param id
     */
    cartDelete( id: string ) {
        let n = this.cartGetIndex( id );
        if( n >= 0 ){
            this.cart.splice( n, 1 );

            // Subscribed to by CartComponent
            this.cartChangeEmitter.emit( this.cart );
            // Subscribed to by HeaderComponent for the little counter on top menu.
            this.updateCartCount();
        }
    }


    /**
     * Returns true if item is in this cart.
     *
     * @param id
     * @returns {boolean}
     */
    cartHas( id: string ): boolean {
        for( let item of this.cart ){
            if( item.id === id ){
                return true;
            }
        }
        return false;
    }


    /**
     * Returns an item by its ID
     *
     * @param id
     * @param type
     * @returns {any}
     */
    cartGet( id: string ) {
        for( let item of this.cart ){
            if( item.id === id ){
                return item;
            }
            return {};
        }
    }

    /**
     * Returns the index in the cart array, by id.
     *
     * @param {string} id
     * @returns {number}
     */
    cartGetIndex( id: string ): number {
        let len = this.cart.length;
        for( let f = 0; f < len; f++ ){
            if( this.cart[f].id === id ){
                return f;
            }
        }
        return -1;
    }

    /**
     * So far we only use this to get a count of selected children.
     *
     * @param subjectId
     * @returns {Array}
     */
    cartGetIndexByParent( subjectId: string ): number[] {
        let results = [];
        let len = this.cart.length;
        for( let f = 0; f < len; f++ ){
            if( this.cart[f].subjectId === subjectId ){
                results.push( f );
            }
        }
        return results;
    }


    cartGetAll() {
        return this.cart;
    }

    cartGetCount() {
        return this.cart.length;
    }


    setCartStatus( subject: string, status ){
        this.cartStatus[subject] = status;
    }

    getCartStatus( subject: string ){
        return this.cartStatus[subject];
    }

    clearCartStatus(){
        this.cartStatus = [];
    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
