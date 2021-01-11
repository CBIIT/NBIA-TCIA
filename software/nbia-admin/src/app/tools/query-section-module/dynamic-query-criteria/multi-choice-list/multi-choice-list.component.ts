import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { AndOrTypes } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import { takeUntil } from 'rxjs/operators';
import { PreferencesService } from '@app/preferences/preferences.service';
import { Subject } from 'rxjs';


@Component( {
    selector: 'nbia-multi-choice-list',
    templateUrl: './multi-choice-list.component.html',
    styleUrls: ['./multi-choice-list.component.scss', '../../left-section/left-section.component.scss']
} )

export class MultiChoiceListComponent implements OnInit, OnDestroy{
    @Input() queryCriteriaData = {};
    sequenceNumber = -1;
    multiChoiceListShowCriteria = true;
    options = ['And', 'Or']; // We use the index of these, don't change the sequence. FIXME
    haveInput = false;
    andOrRadio = [];
    listCheckboxes = [];
    showListSearch = false;
    listSearchInput = '';
    listSearchInputHold = '';
    listSearchResultsCount = 0;
    andOrTypes = AndOrTypes;
    andOrType;

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
                this.currentFont = data;
            } );
        // Get the initial font size value
        this.currentFont = this.preferencesService.getFontSize();

    }

    initItemList( origList ) {
        for( let n = 0; n < origList.length; n++ ){
            this.itemList[n] = {};
            this.itemList[n]['value'] = origList[n];
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

   //     console.log( 'MHL Data: ', this.itemList );
        let maxInitialCountHeight = 10;
        maxInitialCountHeight = 16;
        // Set height to show all collections, or maxInitialCountHeight collections, which ever is less.


        // let h = Math.min( this.itemList.length, maxInitialCountHeight ) * 26; // FIXME
/*

        let h = 152;
        document.getElementById( 'multi-choice-list-scroller' ).style.height = h + 'px';

*/
        /*
               this.andOrRadio[0] = false;  // FIXME TEMP TESTING  Get this from  @Input() queryCriteriaData;
               this.andOrRadio[1] = true;  // FIXME TEMP TESTING
        */
        this.andOrRadio[0] = (this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'].toUpperCase() === 'AND');
        this.andOrRadio[1] = (this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'].toUpperCase() !== 'AND');
        this.andOrType = this.queryCriteriaData['dynamicQueryCriteriaAndOrType'].toUpperCase();
        console.log('MHL this.andOrType: ', this.andOrType );
        for( let n = 0; n < this.itemList.length; n++ ){
            this.listCheckboxes[n] = false;
        }
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
                    .includes( e.toUpperCase() ) || this.listCheckboxes[n]
            );
            console.log('MHL item[\'include\']:', item['include']);

            if( item['include']){
                this.listSearchResultsCount++;
            }
            n++;
        }
        console.log( 'MHL onSearchChange this.itemList: ', this.itemList );

    }

    onMultiListAndOrRadioClick( i ) {

    }

    onClearClick() {
        console.log( 'MHL clear' );
        for( let n = 0; n < this.listCheckboxes.length; n++ ){
            this.listCheckboxes[n] = false;
        }
        this.doHaveInput();
        this.onSearchChange( this.currentFilterSearch) ;
    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
