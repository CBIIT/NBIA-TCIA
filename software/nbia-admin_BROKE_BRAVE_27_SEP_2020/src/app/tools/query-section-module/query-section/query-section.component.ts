import { Component, Input, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { QuerySectionService } from '../services/query-section.service';

@Component( {
    selector: 'nbia-query-section',
    templateUrl: './query-section.component.html',
    styleUrls: ['./query-section.component.scss']
} )

export class QuerySectionComponent implements OnInit{
    /**
     * If this component is used by perform QC we need to show the QC status section.
     * If this component is used by approve-deletions, do not show the QC status section.
     * This value is set by the parent html.
     */
    @Input() currentTool;

    /**
     * Show or hide the entire left query section.
     */
    show = true;

    /**
     * Criteria Search or Text Search.
     */
    currentTab = Consts.CRITERIA_SEARCH;

    consts = Consts;

    constructor( private querySectionService: QuerySectionService) {
    }

    ngOnInit() {
    }

    onCloserOpenerClick(  ){
        this.show = (! this.show);
    }

    onTabClick(i){
        this.currentTab = i;
        this.querySectionService.setSearchType(this.currentTab);
    }
}
