import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AndOrTypes } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import { ResizedEvent } from 'angular-resize-event';
import { takeUntil } from 'rxjs/operators';
import { PreferencesService } from '@app/preferences/preferences.service';
import { Subject } from 'rxjs';

@Component( {
    selector: 'nbia-two-level-multi-choice',
    templateUrl: './two-level-multi-choice.component.html',
    styleUrls: ['./two-level-multi-choice.component.scss', '../../left-section/left-section.component.scss']
} )
export class TwoLevelMultiChoiceComponent implements OnInit, OnDestroy{
    @Input() queryCriteriaData;
    sequenceNumber = -1;
    twoLevelMultiChoiceShowCriteria = true;
    showListSearch = false;
    options = ['And', 'Or'];
    haveInput = false;
    width: number;
    height: number;
    listSearchInput = '';
    andOrTypes = AndOrTypes;
    subItemsSelected: boolean[][] = [[]];
    itemsSelected: number[] = [];

    subMenuType = 1;

    currentFont;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private preferencesService: PreferencesService ) {
    }

    ngOnInit() {
        console.log( 'MHL XXXXXXXXXXXXXXXXX  TwoLevelMultiChoiceComponent ngOnInit: ', this.queryCriteriaData );
        this.sequenceNumber = this.queryCriteriaData['sequenceNumber'];
        this.preferencesService.setFontSizePreferencesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentFont = data;
            } );

        // Get the initial font values
        this.currentFont = this.preferencesService.getFontSize();


        for( let i = 0; i < this.queryCriteriaData['dynamicQueryCriteriaCheckboxArray'].length; i++){
            this.subItemsSelected[i] = [];
            for( let c = 0; c < this.queryCriteriaData['dynamicQueryCriteriaCheckboxArray'][i]['subItems'].length; c++){
                this.subItemsSelected[i][c] = false;
            }
        }
        this.updateItemsSelected();
    }

    onResized( event: ResizedEvent ) {
        this.width = event.newWidth;
        this.height = event.newHeight;
    }


    /*
     [
                {
                    'item': 'Alpha',
                    'subItems': ['Alpha One', 'Alpha Two', 'Alpha Three']
                }, {
                    'item': 'Bravo',
                    'subItems': ['Bravo One', 'Bravo Two', 'Bravo Three']
                }, {
                    'item': 'Charlie',
                    'subItems': ['Charlie One', 'Charlie Two', 'Charlie Three']
                }, {
                    'item': 'Delta',
                    'subItems': ['Delta One', 'Delta Two', 'Delta Three']
                }, {
                    'item': 'Echo',
                    'subItems': ['Echo One', 'Echo Two', 'Echo Three']
                }]
     */
    onSubItemDropdownClick( i, c ) {
        console.log( 'MHL this.queryCriteriaData: ', this.queryCriteriaData.dynamicQueryCriteriaCheckboxArray );
        console.log( 'MHL onSubItemDropdownClick( ' + i + ', ' + c + ' )' );
        console.log( 'MHL onSubItemDropdownClick( ' + this.queryCriteriaData.dynamicQueryCriteriaCheckboxArray[i].item +
            ', ' + this.queryCriteriaData.dynamicQueryCriteriaCheckboxArray[i].subItems[c] + ' )' );
        this.subItemsSelected[i][c] = !this.subItemsSelected[i][c];
        this.updateItemsSelected();
    }

    updateItemsSelected(){
        for( let i = 0; i < this.queryCriteriaData['dynamicQueryCriteriaCheckboxArray'].length; i++){
            this.itemsSelected[i] = 0;
            for( let c = 0; c < this.queryCriteriaData['dynamicQueryCriteriaCheckboxArray'][i]['subItems'].length; c++){
               if( this.subItemsSelected[i][c] ){
                   this.itemsSelected[i]++;
               }
            }
        }

    }

    onShowCriteriaClick( state ) {
        this.twoLevelMultiChoiceShowCriteria = state;
    }

    onClearClick() {
        console.log( 'MHL clear' );
    }

    onSearchGlassClick() {
        console.log( 'MHL nbia-two-level-multi-choice: onSearchGlassClick' );
        this.showListSearch = (!this.showListSearch);
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

    /*
        onCriteriaClicked( i ) {
            this.listCheckboxes[i] = !this.listCheckboxes[i];

            this.doHaveInput();
            console.log( 'MHL this.listCheckboxes: ', this.listCheckboxes );
            console.log( 'MHL nbia-multi-choice-list onCriteriaClicked: ', i );
        }
    */
    doHaveInput() {
        /*
               this.haveInput = false;
               for( let box of this.listCheckboxes ){
                   if( box ){
                       console.log( 'MHL box: ', box );
                       this.haveInput = true;
                       return;
                   }
               }
       */
    }

    onRemoveCriteriaClick() {
        console.log( 'MHL nbia-two-level-multi-choice: onRemoveCriteriaClick' );
    }

    onMultiListAndOrRadioClick( i ) {

    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
