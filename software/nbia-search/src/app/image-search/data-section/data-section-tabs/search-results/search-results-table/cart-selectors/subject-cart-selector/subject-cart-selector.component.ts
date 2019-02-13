import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { CartService } from '@app/common/services/cart.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { UtilService } from '@app/common/services/util.service';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-subject-cart-selector',
    templateUrl: './subject-cart-selector.component.html',
    styleUrls: ['../cart-selector.scss']
} )

/**
 * The Cart buttons in the top level search results. Clicking one of these carts adds all Series for one Subject.
 */
export class SubjectCartSelectorComponent implements OnInit, OnDestroy{

    selected = false;
    childSelected = false;
    selectedChildCount = 0;

    // These are set by SearchResultsTableComponent
    @Input() row;
    @Input() subjectId = '';
    @Input() studyIdentifiers;
    @Input() matchedSeries;
    @Input() seriesId = '';

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private cartService: CartService,
                 private apiServerService: ApiServerService, private loadingDisplayService: LoadingDisplayService,
                 private utilService: UtilService ) {
    }

    ngOnInit() {

        // TODO rewrite this comment, no Check anymore
        // Called when the select all check to the right of the word 'Cart' in the table header is clicked.
        // data is true if this Subject is now selected, false if it is not.
        this.commonService.searchResultsCartCheckEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.selected = <boolean>data;
                this.setCartSelect();
            }
        );


        // Called when the "select these" to the right of the word 'Cart' in the table header is clicked.
        this.commonService.searchResultsCartCheckSubsetEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                // Is the subject in the subset?
                for( let f = 0; f < data['subjects'].length; f++ ){

                    if( data['subjects'][f] === this.subjectId ){
                        this.selected = data['state'];
                        this.setCartSelect();
                    }
                }
            }
        );


        // A child will emit this, we need to see if it is our child, if so, update.
        // Gives us the ID of the Subject, that just searched for children/Series
        // This is a result of cartGetSeriesForSubject
        this.apiServerService.seriesForSubjectResultsEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                // Is it this Subject?
                if( data['id'] === this.subjectId ){
                    this.updateCartButtonClass();
                }
            }
        );
        this.apiServerService.seriesForSubjectErrorEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            err => {
                console.error( 'SubjectCartSelectorComponent seriesForSubjectErrorEmitter.subscribe: ', err );
            }
        );


        // Listen for changing Cart buttons in the children, that should change the parent
        this.commonService.seriesCartChangeEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                // Is it me?
                if( data['subjectId'] === this.subjectId ){
                    this.updateCartButtonClass();
                }
            }
        );


        this.cartService.cartClearEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.childSelected = false;
                this.selected = false;
                this.selectedChildCount = 0;
            }
        );

        // Sets the color
        this.updateCartButtonClass();
    }


    /**
     * Sets the color of a Cart button by changing childSelected and selected, which triggers a change in the HTML class
     */
    updateCartButtonClass() {
        // Is this a Parent (Subject) Cart button?
        if( (!this.utilService.isNullOrUndefined( this.studyIdentifiers )) && (this.studyIdentifiers.length > 0) ){
            this.selectedChildCount = this.cartService.cartGetIndexByParent( this.subjectId ).length;

            // Are any child (series) Cart buttons selected?
            if( this.selectedChildCount > 0 ){

                // Are all child (series) Cart buttons selected? - Green
                if( this.selectedChildCount === this.row.matchedSeries ){
                    this.childSelected = false;
                    this.selected = true;
                }
                // Are less than all child (series) Cart buttons selected? - Yellow
                else{
                    this.childSelected = true;
                    this.selected = false;
                }
            }
            // Are no child (series) Cart buttons selected? - White
            else{
                this.childSelected = false;
                this.selected = false;
            }


        }

    }

    /**
     * Toggles the Cart button -  set selected if some but not all are selected
     */
    onSubjectCartClick() {
        if( (this.selectedChildCount < this.row.matchedSeries) && (this.selectedChildCount > 0) ){
            this.selected = true;
        }
        else{
            this.selected = (!this.selected);
        }
        this.setCartSelect();
        this.commonService.updateSubjectCartStatus( this.subjectId, this.selected );
    }


    /**
     * For this Subject ID we want to set the children (all of them), then call  updateCartButtonClass()
     */
    setCartSelect() {
        // Runs a search   apiServerService.doSearch( Consts.SERIES_FOR_SUBJECT, query, subjectId, selected );
        this.cartService.cartGetSeriesForSubject( this.subjectId, this.studyIdentifiers, this.selected );
        // this.updateCartButtonClass();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
