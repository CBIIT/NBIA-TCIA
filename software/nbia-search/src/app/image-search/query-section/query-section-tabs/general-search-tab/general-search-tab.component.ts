import { Component, OnInit } from '@angular/core';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-general-search-tab',
    templateUrl: './general-search-tab.component.html',
    styleUrls: ['./general-search-tab.component.scss']
} )
export class GeneralSearchTabComponent implements OnInit {

    properties = Properties;

    constructor() {
    }

    ngOnInit() {
    }


}
