// -------------------------------------------------------------------------------------------
// -----------------------             Released (radio buttons)             ------------------
// -------------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { QuerySectionService } from '../services/query-section.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisplayQueryService } from '../../display-query-module/display-query/display-query.service';
import { PreferencesService } from '@app/preferences/preferences.service';


@Component( {
    selector: 'nbia-query-released',
    templateUrl: './query-released.component.html',
    styleUrls: [
        './query-released.component.scss',
        '../left-section/left-section.component.scss',
    ],
} )

export class QueryReleasedComponent implements OnInit, OnDestroy{
    @Input() currentTool;

    options = ['Yes', 'No', 'Ignore'];
    currentOption = 2;
    showCriteriaList = false;
    cBox = [];
    currentFont;

    consts = Consts;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private querySectionService: QuerySectionService,
        private displayQueryService: DisplayQueryService,
        private preferencesService: PreferencesService
    ) {
    }

    ngOnInit() {

        // Initialize the checkbox array and set choice to "Ignore"
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

    // When a radio button is clicked.
    onClick( i ) {
        this.clearCBox();
        this.currentOption = i;
        this.cBox[i] = true;
        this.updateQuery();
    }

    updateQuery() {
        // Ignore
        if( this.currentOption === 2 ){
            this.querySectionService.updateSearchQuery(
                this.currentTool,
                Consts.QUERY_CRITERIA_RELEASED,
                null
            );
            // Yes or No
        }else{
            this.querySectionService.updateSearchQuery(
                this.currentTool,
                Consts.QUERY_CRITERIA_RELEASED,
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
