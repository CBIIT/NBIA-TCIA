import { Component, Input, OnInit } from '@angular/core';
import { AndOrTypes } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import {takeUntil} from "rxjs/operators";
import {PreferencesService} from "@app/preferences/preferences.service";
import {Subject} from "rxjs";

@Component( {
    selector: 'nbia-small-text-input',
    templateUrl: './small-text-input.component.html',
    styleUrls: [
        './small-text-input.component.scss',
        '../../left-section/left-section.component.scss',
    ],
} )
export class SmallTextInputComponent implements OnInit{
    @Input() queryCriteriaData;
    sequenceNumber = -1;
    andOrTypes = AndOrTypes;
    criteriaSmallTextInputShowCriteria = true;
    criteriaSmallTextInputText = '';
    currentFont;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(private preferencesService: PreferencesService) {
    }

    ngOnInit() {
        // For Unit test
        if( this.queryCriteriaData === undefined ){
            this.queryCriteriaData = [];
        }


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

    onShowCriteriaClick( state ) {
        this.criteriaSmallTextInputShowCriteria = state;
    }

    onClearClick() {
        console.log( 'MHL nbia-small-text-input: onClearClick' );
        this.criteriaSmallTextInputText = '';
    }

    onApplyCriteriaClick() {
        console.log( 'MHL nbia-small-text-input: onApplyCriteriaClick' );
    }

    onRemoveCriteriaClick() {
        console.log( 'MHL nbia-small-text-input: onRemoveCriteriaClick' );
    }
}
