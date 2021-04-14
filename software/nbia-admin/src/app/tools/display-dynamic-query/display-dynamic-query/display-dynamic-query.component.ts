import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DisplayDynamicQueryService } from '@app/tools/display-dynamic-query/display-dynamic-query/display-dynamic-query.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '@app/admin-common/services/api.service';

@Component( {
    selector: 'nbia-display-dynamic-query',
    templateUrl: './display-dynamic-query.component.html',
    styleUrls: ['./display-dynamic-query.component.scss']
} )
export class DisplayDynamicQueryComponent implements OnInit, OnDestroy{
    @Input() currentTool;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    data = '';
    constructor( private displayDynamicQueryService: DisplayDynamicQueryService, private apiService: ApiService ) {
    }

    ngOnInit() {
        this.displayDynamicQueryService.displayDynamicQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe( ( data ) => {
            this.data = data;
        });

        }

    /**
     * The "Clear" button on the left side of the Display query.
     */
    onClearQueryClick() {
        this.displayDynamicQueryService.clearQuerySectionQuery();
        this.apiService.setNoSearch();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


}
