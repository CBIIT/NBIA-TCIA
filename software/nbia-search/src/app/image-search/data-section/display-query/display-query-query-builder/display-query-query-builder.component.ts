import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-display-query-criteria-search',
    templateUrl: './display-query-query-builder.component.html',
    styleUrls: ['../display-query.component.scss']
} )
export class DisplayQueryQueryBuilderComponent implements OnInit, OnDestroy{

    data = []; // FIXME rename this
    anyOrAll;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService ) {
    }

    ngOnInit() {
        this.commonService.updateQueryBuilderForDisplayEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.data = <any>data;
            }
        );

        this.commonService.queryBuilderAnyOrAllEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.anyOrAll = data;
            }
        );

        this.anyOrAll = this.commonService.getQueryBuilderAnyOrAll();
    }

    onClickClearQuery() {
        this.commonService.clearAllQueryBuilder();
        this.data = [];
    }

    // FIXME this is a dupe
    cleanQuery( q ) {
        return q.slice().replace( new RegExp( '\\|\\|', 'g' ), ' \|\| ' )
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
