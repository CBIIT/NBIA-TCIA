import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DisplayQueryService } from './display-query.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Consts } from '@app/constants';

@Component( {
    selector: 'nbia-display-query',
    templateUrl: './display-query.component.html',
    styleUrls: ['./display-query.component.scss']
} )
export class DisplayQueryComponent implements OnInit, OnDestroy{
    @Input() currentTool;

    displayQuery;
    displayQueryData;
    consts = Consts;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private displayQueryService: DisplayQueryService ) {
    }

    ngOnInit() {
        this.displayQueryService.displayQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.displayQueryData = data;

                switch( data[0]['tool'] ){
                    case Consts.TOOL_PERFORM_QC:
                        this.displayQuery = this.buildDisplayQueryArray( data );
                        break;
                    case Consts.TOOL_APPROVE_DELETIONS:
                        this.displayQuery = this.buildDisplayQueryArray( data );
                        break;
                }

            } );
    }

    buildDisplayQueryArray( q ) {
        for( let i = 0; i < q.length; i++ ){
            switch( q[i]['criteria'] ){

                case Consts.QUERY_CRITERIA_QC_STATUS:
                    q[i]['displayName'] = 'QC Status';
                    q[i]['displayData'] = [];
                    for( let f = 0; f < q[i]['data'].length; f++ ){
                        if( q[i]['data'][f] ){
                            q[i]['displayData'].push( Consts.QC_STATUSES[f] );
                        }
                    }

                    break;
                case Consts.QUERY_CRITERIA_COLLECTION:
                    q[i]['displayName'] = 'Collection';
                    q[i]['displayData'] = q[i]['data'];
                    break;
                case Consts.QUERY_CRITERIA_RELEASED:
                    q[i]['displayName'] = 'Released';
                    if( q[i]['data'] === 0 ){
                        q[i]['displayData'] = 'Yes';
                    }else if( q[i]['data'] === 1 ){
                        q[i]['displayData'] = 'No';
                    }

                    break;
                case Consts.QUERY_CRITERIA_BATCH_NUMBER:
                    q[i]['displayName'] = 'Batch num.';
                    q[i]['displayData'] = q[i]['data'];

                    break;
                case Consts.QUERY_CRITERIA_CONFIRMED_COMPLETE:
                    q[i]['displayName'] = 'Confirmed as Complete';
                    if( q[i]['data'] === 0 ){
                        q[i]['displayData'] = 'Yes';
                    }else if( q[i]['data'] === 1 ){
                        q[i]['displayData'] = 'No';
                    }

                    break;
                case Consts.QUERY_CRITERIA_SUBJECT_ID:
                    if( q[i]['data'].length > 0 ){
                        q[i]['displayName'] = 'Subject Ids';

                    }else{
                        q[i]['displayName'] = 'Subject Ids';
                    }

                    q[i]['displayData'] = [];
                    for( let f = 0; f < q[i]['data'].length; f++ ){
                        q[i]['displayData'].push( q[i]['data'][f] );
                    }
                    break;

                case Consts.QUERY_CRITERIA_MOST_RECENT_SUBMISSION:
                    q[i]['displayName'] = 'Most recent submission';
                    q[i]['displayData'] = q[i]['data'];
                    break;
            }
        }
        return q;
    }

    onClearQueryClick() {
        this.displayQueryService.clearQuerySectionQuery();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
