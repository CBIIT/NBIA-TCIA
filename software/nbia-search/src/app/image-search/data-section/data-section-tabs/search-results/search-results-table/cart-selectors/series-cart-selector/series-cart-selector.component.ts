import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { CartService } from '@app/common/services/cart.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Subject } from 'rxjs';

@Component( {
    selector: 'nbia-series-cart-selector',
    templateUrl: './series-cart-selector.component.html',
    styleUrls: ['../cart-selector.scss']
} )

/**
 * Used in SeriesOrigComponent
 */
export class SeriesCartSelectorComponent implements OnInit, OnDestroy{

    selected = false;

    // These values are passed in by subject-details/series/series.orig.component.html
    @Input() row;
    @Input() subjectId = '';
    @Input() studyIdentifiers;
    @Input() seriesId = '';
    @Input() studyId;
    @Input() seriesPkId = '';
    @Input() exactSize;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private cartService: CartService, private apiServerService: ApiServerService ) {
    }

    ngOnInit() {

        // Called when the select all check to the right of the word 'Cart' in the table header is clicked.
        this.commonService.searchResultsCartCheckEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.selected = <boolean>data;
                this.setCartSelect();
            }
        );


        // Is this one part of new search results?
        this.apiServerService.seriesForSubjectResultsEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                if( data['id'] === this.subjectId ){
                    this.updateCartButtonClass();
                }
            }
        );
        this.apiServerService.seriesForSubjectErrorEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            err => {
                console.error( 'SeriesCartSelectorComponent seriesForSubjectErrorEmitter.subscribe: ', err );
            }
        );

        // When the cart button for the Study is clicked.
        this.commonService.checkSeriesByStudyEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                if( data['studyId'] === this.studyId ){
                    this.selected = data['state'];
                    this.setCartSelect();
                }
            }
        );

        this.cartService.cartClearEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.cartService.cartDelete( this.seriesId );
                this.commonService.updateSeriesCartStatus( this.subjectId, this.seriesId, this.selected );
            }
        )
        this.updateCartButtonClass();
    }

    /**
     * Sets the color of a Cart button by changing childSelected and selected, which triggers a change in the HTML class.
     */
    updateCartButtonClass() {
        if( this.cartService.cartHas( this.seriesId ) ){
            this.selected = true;
        }else{
            this.selected = false;
        }
    }

    /**
     * Toggles the Cart selection
     */
    onCartClick() {
        this.selected = (!this.selected);
        this.setCartSelect();
    }

    /**
     * Called after the selected status has changed (or might have changed).
     * Adds or removes this Series from the Cart.
     */
    setCartSelect() {
        // For type is Subject ID we want to set the children (all of them), then call  updateCartButtonClass()
        // This is a seriesId, and the subjectId is the parent.
        if( this.selected ){
            this.cartService.cartAdd( this.seriesId, this.studyId, this.subjectId, this.seriesPkId, '', this.exactSize );
        }
        else{
            this.cartService.cartDelete( this.seriesId );
        }
        this.commonService.updateSeriesCartStatus( this.subjectId, this.seriesId, this.selected );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
