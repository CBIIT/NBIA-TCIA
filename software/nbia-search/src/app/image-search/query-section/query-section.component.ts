import {Component, OnInit} from '@angular/core';
import {CommonService} from '@app/image-search/services/common.service';
import { Properties } from '@assets/properties';

@Component({
    selector: 'nbia-query-section',
    templateUrl: './query-section.component.html',
    styleUrls: ['./query-section.component.scss']
})

/**
 *
 */
export class QuerySectionComponent implements OnInit {
    properties = Properties;
    show = true;

    constructor(private commonService: CommonService) {
    }

    ngOnInit() {
    }

    onCloserClick() {
        this.show = !this.show;
        this.commonService.showQuerySection( this.show );
    }
}
