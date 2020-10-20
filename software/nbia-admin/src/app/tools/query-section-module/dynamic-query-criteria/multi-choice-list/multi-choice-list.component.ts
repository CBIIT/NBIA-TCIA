import { Component, Input, OnInit } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { AndOrTypes } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';


@Component( {
    selector: 'nbia-multi-choice-list',
    templateUrl: './multi-choice-list.component.html',
    styleUrls: ['./multi-choice-list.component.scss', '../../left-section/left-section.component.scss']
} )

export class MultiChoiceListComponent implements OnInit{
    @Input() queryCriteriaData = {};
    sequenceNumber = -1;
    multiChoiceListShowCriteria = true;
    options = ['And', 'Or'];
    haveInput = false;
    cBox = [];
    listCheckboxes = [];
    width: number;
    height: number;
    showListSearch = false;
    listSearchInput = '';
    andOrTypes = AndOrTypes;

    constructor() {
    }

    ngOnInit() {
        this.sequenceNumber = this.queryCriteriaData['sequenceNumber'];
        this.init( this.queryCriteriaData['dynamicQueryCriteriaDataArray'] );
    }

    /**
     * Default added to keep unit test working. @TODO See if we can get rid of this.
     * @param data
     */
    init( data = '' ) {

        let maxInitialCountHeight = 10;
        maxInitialCountHeight = 16;
        // Set height to show all collections, or maxInitialCountHeight collections, which ever is less.
        let h = Math.min( data.length, maxInitialCountHeight ) * 26;
        document.getElementById( 'collections' ).style.height = h + 'px';

        this.cBox[0] = false;  // FIXME TEMP TESTING  Get this from  @Input() queryCriteriaData;
        this.cBox[1] = true;  // FIXME TEMP TESTING

        for( let n = 0; n < data.length; n++ ){
            this.listCheckboxes[n] = false;
        }
        console.log( 'MHL clear init: ', this.listCheckboxes );

    }


    onResized( event: ResizedEvent ) {
        this.width = event.newWidth;
        this.height = event.newHeight;
    }

    onShowCriteriaClick( state ) {
        this.multiChoiceListShowCriteria = state;
    }


    onRemoveCriteriaClick() {
        console.log( 'MHL nbia-multi-choice-list: onRemoveCriteriaClick' );
    }

    onSearchGlassClick() {
        console.log( 'MHL nbia-multi-choice-list: onSearchGlassClick' );
        this.showListSearch = (!this.showListSearch);
    }

    onCriteriaClicked( i ) {

        this.listCheckboxes[i] = !this.listCheckboxes[i];

        this.doHaveInput();
        console.log( 'MHL this.listCheckboxes: ', this.listCheckboxes );

        console.log( 'MHL nbia-multi-choice-list onCriteriaClicked: ', i );
    }

    doHaveInput() {
        this.haveInput = false;
        for( let box of this.listCheckboxes ){
            if( box ){
                console.log( 'MHL box: ', box );
                this.haveInput = true;
                return;
            }
        }

    }

    onSearchTextOutFocus( n ) {
        console.log( 'MHL onSearchTextOutFocus: ', n );
    }

    onSearchTextFocus( n ) {
        console.log( 'MHL onSearchTextFocus: ', n );
    }

    onSearchChange( e ) {
        console.log( 'MHL onSearchChange: ', e );
    }

    onMultiListAndOrRadioClick( i ) {

    }

    onClearClick() {
        console.log( 'MHL clear' );
        for( let n = 0; n < this.listCheckboxes.length; n++ ){
            this.listCheckboxes[n] = false;
        }
        this.doHaveInput();
    }
}
