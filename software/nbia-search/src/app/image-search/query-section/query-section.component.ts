import {Component, OnInit} from '@angular/core';
import {CommonService} from '@app/image-search/services/common.service';

@Component({
    selector: 'nbia-query-section',
    templateUrl: './query-section.component.html',
    styleUrls: ['./query-section.component.scss']
})

/**
 * Currently this is just a wrapper around QuerySectionTabsComponent. If it does not eventually serve a purpose, I will remove it.
 */
export class QuerySectionComponent implements OnInit {

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
