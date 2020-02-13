import { Component, Input, OnInit } from '@angular/core';


@Component( {
    selector: 'nbia-left-section',
    templateUrl: './left-section.component.html',
    styleUrls: ['./left-section.component.scss']
} )

/**
 *  This is the parent component for the Left section, it contains query-section.
 *  It has the show and hide buttons at the top which "close" and "open" the whole left query-section.
 */
export class LeftSectionComponent implements OnInit{
    @Input() useQcStatusLeftSectionComponent;
    @Input() currentTool;

    constructor() {
    }

    ngOnInit() {
    }
}
