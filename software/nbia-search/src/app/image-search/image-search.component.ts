import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiServerService } from './services/api-server.service';
import { CommonService } from './services/common.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-image-search',
    templateUrl: './image-search.component.html',
    styleUrls: ['./image-search.component.scss']
} )
export class ImageSearchComponent implements OnInit, OnDestroy{

    showQuerySection = true;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    // FIXME pull out this ApiServerService - just for dev time testing
    constructor( private apiServerService: ApiServerService, private commonService: CommonService ) {
    }

    ngOnInit() {

        this.commonService.showQuerySectionEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.showQuerySection = <boolean>data;
            }
        );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
