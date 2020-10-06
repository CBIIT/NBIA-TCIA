// -------------------------------------------------------------------------------------------
// --------------------------         Confirmed as Complete        ---------------------------
// -------------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuerySectionService } from '../services/query-section.service';
import { Consts } from '@app/constants';
import { Subject } from 'rxjs';
import { DisplayQueryService } from '../../display-query-module/display-query/display-query.service';
import { takeUntil } from 'rxjs/operators';
import { PreferencesService } from '@app/preferences/preferences.service';


@Component( {
    selector: 'nbia-query-confirmed',
    templateUrl: './query-confirmed.component.html',
    styleUrls: [
        './query-confirmed.component.scss',
        '../left-section/left-section.component.scss',
    ],
} )

export class QueryConfirmedComponent implements OnInit, OnDestroy{
    @Input() currentTool;

    showCriteriaList = true;
    options = ['Yes', 'No', 'Ignore'];

    // TODO rename
    cBox = [];
    currentFont;
    currentOption = 2;
    consts = Consts;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private querySectionService: QuerySectionService,
        private displayQueryService: DisplayQueryService,
        private preferencesService: PreferencesService
    ) {
    }

    ngOnInit() {
        this.initRadioButtons();

        // When the "Clear" button in the Display query at the top is clicked.
        this.displayQueryService.clearQuerySectionQueryEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( () => {
                this.initRadioButtons();
                this.updateQuery();
            } );

        // Get font size
        this.preferencesService.setFontSizePreferencesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.currentFont = data;
            } );
        // Get the initial value
        this.currentFont = this.preferencesService.getFontSize();
    }

    initRadioButtons() {
        this.clearCBox();
        this.currentOption = 2;
        this.cBox[this.currentOption] = true;
    }

    onShowCriteriaListClick( s ) {
        this.showCriteriaList = s;
    }

    onClick( i ) {
        this.clearCBox();
        this.cBox[i] = true;
        this.currentOption = i;
        this.updateQuery();
    }

    updateQuery() {
        // Ignore
        if( this.currentOption === 2 ){
            this.querySectionService.updateSearchQuery(
                this.currentTool,
                Consts.QUERY_CRITERIA_CONFIRMED_COMPLETE,
                null
            );
        }
        // Yes or No (this.currentOption)
        else{
            this.querySectionService.updateSearchQuery(
                this.currentTool,
                Consts.QUERY_CRITERIA_CONFIRMED_COMPLETE,
                this.currentOption
            );
        }
    }

    clearCBox() {
        for( let i = 0; i < this.options.length; i++ ){
            this.cBox[i] = false;
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
