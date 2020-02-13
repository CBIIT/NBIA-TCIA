import { Component, OnInit } from '@angular/core';
import { Properties } from '../../../assets/properties';


@Component( {
    selector: 'nbia-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
} )

/**
 * @TODO This will likely need to be the same as nbia-search
 */
export class HeaderComponent implements OnInit{

    properties = Properties;

    constructor() {
    }

    ngOnInit() {
    }

}
