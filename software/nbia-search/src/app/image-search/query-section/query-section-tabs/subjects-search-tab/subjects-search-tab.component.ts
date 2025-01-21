import { Component, OnInit } from '@angular/core';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-subjects-search-tab',
    templateUrl: './subjects-search-tab.component.html',
    styleUrls: ['./subjects-search-tab.component.scss']
} )
export class SubjectsSearchTabComponent implements OnInit {

    properties = Properties;

    constructor() {
    }

    ngOnInit() {
    }


}
