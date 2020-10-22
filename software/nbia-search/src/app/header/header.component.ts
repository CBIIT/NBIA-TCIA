import { Component, OnDestroy, OnInit } from '@angular/core';
import { Properties } from '@assets/properties';


@Component( {
    selector: 'nbia-header',
    templateUrl: './header.component.html',
    styleUrls: ['../app.component.scss', './header.component.scss']
} )

export class HeaderComponent implements OnInit{

    properties = Properties;
    constructor(  ) {
    }

    ngOnInit() {

    }

}
