import { Component, Input, OnInit } from '@angular/core';

@Component( {
    selector: 'nbia-query-section',
    templateUrl: './query-section/query-section.component.html',
    styleUrls: ['./query-section/query-section.component.scss']
} )

export class QuerySectionComponent implements OnInit{
    /**
     * If this component is used by qc-tool (perform QC) we need to show the QC status section.
     * If this component is used by approve-deletions, do not show the QC status section.
     * This value is set by the parent html.
     */
    @Input() useQcStatusQuerySectionComponent = true; // Default to true.
    @Input() currentTool;

    /**
     * Show or hide the entire left query section.
     */
    show = true;


    constructor() {
    }

    ngOnInit() {
    }

    onCloserOpenerClick(  ){
        this.show = (! this.show);
    }

}
