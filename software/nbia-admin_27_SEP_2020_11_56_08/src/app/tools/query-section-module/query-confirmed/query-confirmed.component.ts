import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuerySectionService } from '../services/query-section.service';
import { Consts } from '@app/constants';
import { Subject } from 'rxjs';
import { DisplayQueryService } from '../../display-query-module/display-query/display-query.service';
import { takeUntil } from 'rxjs/operators';


@Component( {
    selector: 'nbia-query-confirmed',
    templateUrl: './query-confirmed.component.html',
    styleUrls: ['./query-confirmed.component.scss', '../left-section/left-section.component.scss']
} )

export class QueryConfirmedComponent implements OnInit, OnDestroy{
    @Input() currentTool;

    showCriteriaList = true;
    options = ['Yes', 'No', 'Ignore'];
    cBox = [];
    currentOption = 2;
    consts = Consts;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private querySectionService: QuerySectionService, private displayQueryService: DisplayQueryService ) {
    }

    ngOnInit() {
        this.initRadioButtons();

        this.displayQueryService.clearQuerySectionQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.initRadioButtons();
                this.updateQuery();
            } );

    }

    initRadioButtons() {
        this.clearCBox();
        this.currentOption = 2;
        this.cBox[this.currentOption] = true;
    };


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
            this.querySectionService.updateSearchQuery( this.currentTool, Consts.QUERY_CRITERIA_CONFIRMED_COMPLETE, null );
        }
        // No
        else{
            this.querySectionService.updateSearchQuery( this.currentTool, Consts.QUERY_CRITERIA_CONFIRMED_COMPLETE, this.currentOption );
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
