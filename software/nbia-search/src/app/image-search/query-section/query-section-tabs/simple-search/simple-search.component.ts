import { Component, OnInit } from '@angular/core';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-simple-search',
    templateUrl: './simple-search.component.html',
    styleUrls: ['./simple-search.component.scss']
} )
export class SimpleSearchComponent implements OnInit {

    properties = Properties;

    constructor() {
    }

    ngOnInit() {
    }


}
