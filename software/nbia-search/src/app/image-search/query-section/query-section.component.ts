import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Properties } from '@assets/properties';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-query-section',
    templateUrl: './query-section.component.html',
    styleUrls: ['./query-section.component.scss']
} )

/**
 *
 */
export class QuerySectionComponent implements OnInit, OnDestroy{
    properties = Properties;
    show = true;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService ) {
    }

    ngOnInit() {
        this.commonService.showQuerySectionEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.show = <boolean>data;
            }
        );

    }

    onOpenerClick() {
        this.show = true;
        this.commonService.showQuerySection( true );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
