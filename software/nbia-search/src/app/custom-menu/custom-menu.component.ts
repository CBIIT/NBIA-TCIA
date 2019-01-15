import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-custom-menu',
    templateUrl: './custom-menu.component.html',
    styleUrls: ['./custom-menu.component.scss']
} )
export class CustomMenuComponent implements OnInit{
    properties = Properties;
    homeUrrl = this.properties.API_SERVER_URL + '/nbia-search';

    constructor( private commonService: CommonService ) {
    }

    ngOnInit() {
    }

    /**
     * If there is a dropdown menu with the heading "Help", add "Show Introduction" to the bottom of the menu.
     */
    showIntro() {
        this.commonService.showIntro();
    }

}
