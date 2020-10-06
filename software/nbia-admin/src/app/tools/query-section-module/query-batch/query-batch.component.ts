// -------------------------------------------------------------------------------------------
// -------------------------         Batch Number criteria         ---------------------------
// -------------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuerySectionService } from '../services/query-section.service';
import { Consts } from '@app/constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DisplayQueryService } from '@app/tools/display-query-module/display-query/display-query.service';
import { PreferencesService } from '@app/preferences/preferences.service';


@Component( {
    selector: 'nbia-query-batch',
    templateUrl: './query-batch.component.html',
    styleUrls: [
        './query-batch.component.scss',
        '../left-section/left-section.component.scss',
    ],
} )

export class QueryBatchComponent implements OnInit, OnDestroy{
    @Input() currentTool;

    batchNumber = 1;
    useBatchNumber = false;
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
        // When the "Clear" button in the Display query at the top is clicked.
        this.displayQueryService.clearQuerySectionQueryEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( () => {
                this.batchNumber = 1;
                this.useBatchNumber = false;
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

    onChangeBatchNumber() {
        this.updateQuery();
    }

    onBatchNumberCheckboxClick( c ) {
        this.useBatchNumber = c;
        this.updateQuery();
    }

    updateQuery() {
        if( this.useBatchNumber ){
            this.querySectionService.updateSearchQuery(
                this.currentTool,
                Consts.QUERY_CRITERIA_BATCH_NUMBER,
                this.batchNumber
            );
        }else{
            // A null entry instead of a number tells updateQuery not to include Batch number.
            this.querySectionService.updateSearchQuery(
                this.currentTool,
                Consts.QUERY_CRITERIA_BATCH_NUMBER,
                null
            );
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
