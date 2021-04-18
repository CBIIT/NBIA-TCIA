import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DisplayDynamicQueryService } from '@app/tools/display-dynamic-query/display-dynamic-query/display-dynamic-query.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '@app/admin-common/services/api.service';
import { DynamicQueryBuilderService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-builder.service';
import { Properties } from '@assets/properties';
import { UtilService } from '@app/admin-common/services/util.service';

@Component( {
    selector: 'nbia-display-dynamic-query',
    templateUrl: './display-dynamic-query.component.html',
    styleUrls: ['./display-dynamic-query.component.scss']
} )
export class DisplayDynamicQueryComponent implements OnInit, OnDestroy{
    @Input() currentTool;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    data = '';
    niceDisplayData = [];
    lastElementIndex = 0;
    properties = Properties; //properties.SHOW_SERVER_QUERY

    constructor( private displayDynamicQueryService: DisplayDynamicQueryService, private apiService: ApiService,
                 private dynamicQueryBuilderService: DynamicQueryBuilderService, private utilService: UtilService ) {
    }

    ngOnInit() {
        this.displayDynamicQueryService.displayDynamicQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe( ( data ) => {
            this.data = data;
        } );

        this.displayDynamicQueryService.displayNiceDynamicQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.niceDisplayData = data;
                this.getLastElementIndex();
            } );
    }


    getLastElementIndex() {
        this.lastElementIndex = 0;
        for( let f = 0; f < this.niceDisplayData.length; f++ ){
            if( this.niceDisplayData[f] !== undefined ){
                this.lastElementIndex = f;
            }
        }
    }


    /**
     * The "Clear" button on the left side of the Display query.
     */
    onClearQueryClick() {
        this.data = '';
        this.displayDynamicQueryService.clearQuerySectionQuery();
        this.dynamicQueryBuilderService.clearQuery();
        this.apiService.setNoSearch();
        this.data = '';
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


}
