import { Component, OnInit } from '@angular/core';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-images-search-tab',
    templateUrl: './images-search-tab.component.html',
    styleUrls: ['./images-search-tab.component.scss']
} )
export class ImagesSearchTabComponent implements OnInit {

    properties = Properties;

    constructor() {
    }

    ngOnInit() {
    }


}
