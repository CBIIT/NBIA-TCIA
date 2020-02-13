import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '../../../constants';
import { QuerySectionService } from '../services/query-section.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisplayQueryService } from '../../display-query-module/display-query/display-query.service';

@Component( {
    selector: 'nbia-query-released',
    templateUrl: './query-released.component.html',
    styleUrls: ['./query-released.component.scss', '../left-section/left-section.component.scss']
} )

export class QueryReleasedComponent implements OnInit, OnDestroy{
    @Input() isTop = false;
    @Input() currentTool;

    options = ['Yes', 'No', 'Ignore'];
    currentOption = 2;
    showCriteriaList = false;
    cBox = [];

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

    initRadioButtons(){
        this.clearCBox();
        this.currentOption = 2;
        this.cBox[this.currentOption] = true;

    };

    onShowCriteriaListClick( s ) {
        this.showCriteriaList = s;
    }

    onClick( i ) {
        this.clearCBox();
        this.currentOption = i;
        this.cBox[i] = true;
        this.updateQuery();
    }

    updateQuery() {
        // Ignore
        if( this.currentOption === 2 ){
            this.querySectionService.updateQuery( this.currentTool, Consts.QUERY_CRITERIA_RELEASED, null );
        // Yes
        }else {
            this.querySectionService.updateQuery( this.currentTool, Consts.QUERY_CRITERIA_RELEASED, this.currentOption );
        }
    }

    clearCBox(){
        for( let i = 0; i < this.options.length; i++){
            this.cBox[i] = false;
        }
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


}
