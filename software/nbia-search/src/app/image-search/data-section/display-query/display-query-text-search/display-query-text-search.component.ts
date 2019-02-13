import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-display-query-text-search',
    templateUrl: './display-query-text-search.component.html',
    styleUrls: ['../display-query.component.scss']
} )
export class DisplayQueryTextSearchComponent implements OnInit, OnDestroy{

    displayText: string = '';
    properties = Properties;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private apiServerService: ApiServerService ) {
    }

    ngOnInit() {
        this.commonService.updateTextSearchQueryForDisplayEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.displayText = <string>data;
            } );
    }

    onClearTextQueryClick() {
        this.commonService.clearTextSearchUserInput();
        this.apiServerService.setTextSearchQueryHold(null);


    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
