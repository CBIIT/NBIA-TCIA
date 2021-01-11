import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { takeUntil } from 'rxjs/operators';
import { PreferencesService } from '@app/preferences/preferences.service';
import { Subject } from 'rxjs';


@Component({
    selector: 'nbia-single-choice-list',
    templateUrl: './single-choice-list.component.html',
    styleUrls: ['./single-choice-list.component.scss', '../../left-section/left-section.component.scss']
})

export class SingleChoiceListComponent implements OnInit {
    @Input() queryCriteriaData = {};
    sequenceNumber = -1;
    singleChoiceListShowCriteria = true;
    haveInput = false;
    listRadioButtons = [];
    width: number;
    height: number;
    showListSearch = false;
    listSearchInput = '';
    listSearchInputHold = '';
    listSearchResultsCount = 0;

    // When currentSelection is -1 there is no choice, this criteria will not be part of the query
    currentSelection = -1;

    currentFilterSearch = '';
    itemList = [];
    currentFont;
    searchToolTip = 'Filter list'; // TODO move me

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();


    constructor( private preferencesService: PreferencesService ) {
    }

    ngOnInit() {
        this.sequenceNumber = this.queryCriteriaData['sequenceNumber'];
        this.initItemList( this.queryCriteriaData['dynamicQueryCriteriaCheckboxArray'] )
        this.init();

        // Get font size when it changes
        this.preferencesService.setFontSizePreferencesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                console.log( 'MHL FONT data: ', data );
                this.currentFont = data;
            } );
        // Get the initial font size value
        this.currentFont = this.preferencesService.getFontSize();

    }

    initItemList( origList ) {
        console.log('MHL origList: ' + origList);
        for( let n = 0; n < origList.length; n++ ){
            this.itemList[n] = {};
            this.itemList[n]['value'] = origList[n]; // Get the Text for this list item
            this.itemList[n]['include'] = true;
        }
    }

    /**
     * Default added to keep unit test working. @TODO See if we can get rid of this.
     * @param data
     */
    init() {
        // Sort
        if(this.queryCriteriaData['dynamicQueryCriteriaSort'])
            this.itemList.sort( ( a, b ) =>
                a['value'].toUpperCase().localeCompare( b['value'].toUpperCase() )
            );

        console.log( 'MHL Data: ', this.itemList );
        let maxInitialCountHeight = 10;
        maxInitialCountHeight = 16;
        // Set height to show all collections, or maxInitialCountHeight collections, which ever is less.


        // let h = Math.min( this.itemList.length, maxInitialCountHeight ) * 26; // FIXME

        let h = 152;
        document.getElementById( 'single-choice-list-scroller' ).style.height = h + 'px';

        for( let n = 0; n < this.itemList.length; n++ ){
            this.listRadioButtons[n] = false;
        }

        // If Allow No Choice is false, select the first choice by default
        if( !this.queryCriteriaData['dynamicQueryCriteriaAllowNoChoice']){
            this.listRadioButtons[0] = true;
            this.doHaveInput();
        }
    }


    onResized( event: ResizedEvent ) {
        this.width = event.newWidth;
        this.height = event.newHeight;
    }

    onShowCriteriaClick( state ) {
        this.singleChoiceListShowCriteria = state;
    }


    onRemoveCriteriaClick() {
        console.log( 'MHL nbia-multi-choice-list: onRemoveCriteriaClick' );
    }

    onSearchGlassClick() {
        console.log( 'MHL nbia-multi-choice-list: onSearchGlassClick' );
        this.showListSearch = (!this.showListSearch);
        if( ! this.showListSearch ){
            this.noSearchReset();
            this.listSearchInputHold =  this.listSearchInput;
            this.listSearchInput = '';
        }
        else{
            this.listSearchInput = this.listSearchInputHold;
        }
        this.onSearchChange( this.listSearchInput );
    }

    onCriteriaClicked( i ) {
        if( this.currentSelection >= 0){
            this.listRadioButtons[this.currentSelection] = false;
        }
        this.currentSelection = i;
        console.log( 'MHL 00 this.listRadioButtons: ', this.listRadioButtons );
        console.log( 'MHL 01 this.listRadioButtons[' + i + ']: ', this.listRadioButtons[i] );

        this.listRadioButtons[i] = true;

        this.doHaveInput();
        console.log( 'MHL 02 this.listRadioButtons: ', this.listRadioButtons );
        console.log( 'MHL 03 this.listRadioButtons[' + i + ']: ', this.listRadioButtons[i] );


        console.log( 'MHL nbia-multi-choice-list onCriteriaClicked: ', i );
    }

    doHaveInput() {
        this.haveInput = false;
        for( let box of this.listRadioButtons ){
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

    noSearchReset(){
        for( let item of this.itemList ){
            item['include'] = true;
        }
    }

    onSearchChange( e ) {
        console.log( 'MHL onSearchChange: ', e );
        this.currentFilterSearch = e;
        this.listSearchResultsCount = 0;

        let n = 0;
        let counter = 0;
        for( let item of this.itemList ){
            console.log('MHL item: ', item);
            console.log('MHL [' + n + '] item[\'value\']: ', item['value']);

            item['include'] = !!(
                item['value']
                    .toUpperCase()
                    .includes( e.toUpperCase() ) || this.listRadioButtons[n]
            );
            console.log('MHL item[\'include\']:', item['include']);

            if( item['include']){
                this.listSearchResultsCount++;
            }
            n++;
        }
        console.log( 'MHL onSearchChange this.itemList: ', this.itemList );

    }

    onClearClick() {
        console.log( 'MHL clear' );
        // If Allow No Choice is false, select the first choice by default
        if( !this.queryCriteriaData['dynamicQueryCriteriaAllowNoChoice']){
            console.log('MHL Setting this.listRadioButtons[0] = true');
            this.listRadioButtons[0] = true;
            this.currentSelection = 0;
        }
        else{
            this.currentSelection = -1;
        }

        for( let n = (this.queryCriteriaData['dynamicQueryCriteriaAllowNoChoice']) ? 0 : 1; n < this.listRadioButtons.length; n++ ){
            console.log('MHL n=' + n);
            this.listRadioButtons[n] = false;
        }



        this.doHaveInput();
        this.onSearchChange( this.currentFilterSearch) ;

    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
