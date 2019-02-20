import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { CartService } from '@app/common/services/cart.service';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-studies-cart-selector',
    templateUrl: './studies-cart-selector.component.html',
    styleUrls: ['../cart-selector.scss']
} )

export class StudiesCartSelectorComponent implements OnInit, OnDestroy{
    @Input() subjectDetails;
    @Input() subjectId;
    @Input() study;

    selected = false;
    childSelected = false;

    /**
     * A list of each Series for this Study.
     * <ul>
     *     <li>seriesId</li>
     *     <li>state</li>
     * </ul>
     * @type {Array}
     */
    seriesList = [];

    /**
     * Number of Series within this Subject that are selected.<br>
     * Compared to seriesList.length to determine if some, all, or no Series are selected.
     * @type {number}
     */
    selectedSeriesCount = 0;

    /**
     * This Study's "studyId".
     */
    studyId;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private cartService: CartService,
                 private loadingDisplayService: LoadingDisplayService ) {
    }

    ngOnInit() {
        // When a "Subject ID" is clicked in the Search results, one "study" is passed to this component as an @Input().
        this.studyId = this.study.studyId;

        this.subjectId = this.subjectDetails.subjectId;

        // Populate seriesList with the seriesId for each Series in this Study. Set its state to false, state will be updated in commonService.seriesCartChangeEmitter.subscribe.
        for( let study of this.study.seriesList ){
            this.seriesList.push( { 'seriesId': study.seriesId, 'state': false } );
        }

        // Listen for changing Cart buttons in the children that should change the parent.
        this.commonService.seriesCartChangeEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {

                // Does this Study have the Series that just changed?
                if( this.hasSeries( data['seriesId'] ) ){

                    // Get the count of all selected Series for this Study.
                    this.selectedSeriesCount = this.cartService.cartGetCartByStudy( this.studyId ).length;

                    // In this.seriesList, set the state (selected or not) for this Series.
                    this.setSeriesState( data['seriesId'], data['state'] );

                    // Does this Study have some, all, or no Series selected. Sets Subject Cart button Green, Yellow, or White.
                    this.setClass();
                }
            }
        );

        /**
         *  Listen for changing Cart buttons in the parent that should change this the (middle) child.
         *  This is only called by the parent (highest) level cart button which will only be "All" Green or "None" White.
         *
         *  All of the cart selecting is already getting done,
         *  this is just to update the UI when the children are showing and the parent gets clicked!!!
         */
        this.commonService.subjectCartChangeEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.updateCartButtonDisplay( data );
            }
        );


        this.selectedSeriesCount = this.cartService.cartGetCartByStudy( this.studyId ).length;
        this.setClass();
    }


    /**
     *  Listen for changing Cart buttons in the parent that should change this the (middle) child.
     *  This is only called by the parent (highest) level cart button which will only be "All" Green or "None" White.
     *
     *  All of the cart selecting is already getting done,
     *  this is just to update the UI when the children are showing and the parent gets clicked!!!
     */
    async updateCartButtonDisplay( data ) {
        // Is this the one
        if( data.subjectId === this.subjectId ){

             // CHECKME
            if( data.state ){
                // Green
                this.childSelected = false;
                this.selected = true;

                // Get the count of all selected Series for this Study.
                let selectedSeriesCountTrailer = -1;
                while( selectedSeriesCountTrailer !== this.selectedSeriesCount ){
                    await this.commonService.sleep( 500 );
                    this.selectedSeriesCount = this.cartService.cartGetCartByStudy( this.studyId ).length;
                    selectedSeriesCountTrailer = this.selectedSeriesCount;
                }
            }else{
                // White
                this.childSelected = false;
                this.selected = false;
                this.selectedSeriesCount = 0;
            }


        }

    }


    /**
     * Sets childSelected and selected, based on, some, all, or no Series selected for this Subject.
     */
    setClass() {
        let childStatus = this.childrenStatus();
        switch( childStatus ){
            case 0: // White
                this.childSelected = false;
                this.selected = false;
                break;

            case 1: // Yellow
                this.childSelected = true;
                this.selected = false;
                break;

            case 2: // Green
                this.childSelected = false;
                this.selected = true;
                break;
        }
    }

    /**
     * return  0 if none,  1 if some,  2 if all
     */
    childrenStatus() {
        if( this.selectedSeriesCount === 0 ){
            return 0;
        }
        if( this.selectedSeriesCount < this.seriesList.length ){
            return 1;
        }
        return 2;
    }


    hasSeries( series ) {
        for( let s of this.seriesList ){
            if( s['seriesId'] === series ){
                return true;
            }
        }
        return false;
    }

    setSeriesState( series, state ) {
        let len = this.seriesList.length;
        for( let n = 0; n < len; n++ ){
            if( this.seriesList[n].seriesId === series ){
                this.seriesList[n].state = state;
            }
        }
    }

    /**
     * If all are off, turn them all on.
     * If some, but not all are on, turn them all on.
     * If all are on, turn them all off.
     */
    onStudiesCartClick() {
        // If some but not all are on, turn them all on
        this.loadingDisplayService.setLoadingOn( 'onStudiesCartClick' );
        switch( this.childrenStatus() ){
            case 0:
            case 1:
                // Toggle all on
                this.commonService.setSeriesCheckByStudy( this.study.studyId, true );
                for( let s of this.seriesList ){
                    s.state = true;
                }
                break;

            case 2:
                // Toggle all off
                this.commonService.setSeriesCheckByStudy( this.study.studyId, false );
                for( let s of this.seriesList ){
                    s.state = false;
                }
                break;
        }
        this.setClass();
        this.loadingDisplayService.setLoadingOff();

    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
