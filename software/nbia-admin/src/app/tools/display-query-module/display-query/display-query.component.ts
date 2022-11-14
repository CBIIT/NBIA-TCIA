// ----------------------------------------------------------------------------------------
// ----------                       Display Query at top                          ---------
// ----------     This is updated as criteria are selected from the left side     ---------
// ----------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DisplayQueryService } from './display-query.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Consts } from '@app/constants';
import { Properties } from '@assets/properties';


@Component( {
    selector: 'nbia-display-query',
    templateUrl: './display-query.component.html',
    styleUrls: ['./display-query.component.scss'],
} )

export class DisplayQueryComponent implements OnInit, OnDestroy{
    @Input() currentTool;

    /**
     *
     */
    displayQuery;

    /**
     * displayQueryData is an array.  Each object in the array represents one criteria from the left column.
     * The data will vary depending on the criteria.  The data for each criteria will have everything
     * needed to properly display its part of the query.
     */
    displayQueryData;

    consts = Consts;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private displayQueryService: DisplayQueryService ) {
    }

    ngOnInit() {
        this.displayQueryService.displayQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe( ( data ) => {
            this.displayQueryData = data;
            // At this time, nothing is different for the two tools that use the Display query, but that may change...
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

    /**
     * Builds each part of the display query array the way the HTML/Angular wants it.
     * There is a different (switch) case for each type of search criteria.
     * @param q
     */
    buildDisplayQueryArray( q ) {
        for( let i = 0; i < q.length; i++ ){
            switch( q[i]['criteria'] ){

                case Consts.QUERY_CRITERIA_QC_STATUS:
                    q[i]['displayName'] = Consts.DISPLAY_QUERY_CRITERIA_QC_STATUS;
                    q[i]['displayData'] = [];
                    for( let f = 0; f < q[i]['data'].length; f++ ){
                        if( q[i]['data'][f] ){
                            q[i]['displayData'].push( Properties.QC_STATUSES[f] );
                        }
                    }
                    break;

                case Consts.QUERY_CRITERIA_COLLECTION:
                    q[i]['displayName'] = Consts.DISPLAY_QUERY_CRITERIA_COLLECTION;
                    q[i]['displayData'] = q[i]['data'];
                    break;

                case Consts.QUERY_CRITERIA_RELEASED:
                    q[i]['displayName'] = Consts.DISPLAY_QUERY_CRITERIA_RELEASED;
                    if( q[i]['data'] === 0 ){
                        q[i]['displayData'] = 'Yes';
                    }else if( q[i]['data'] === 1 ){
                        q[i]['displayData'] = 'No';
                    }
                    break;

                case Consts.QUERY_CRITERIA_BATCH_NUMBER:
                    q[i]['displayName'] = Consts.DISPLAY_QUERY_CRITERIA_BATCH_NUMBER;
                    q[i]['displayData'] = [q[i]['data']];
                    break;

                case Consts.QUERY_CRITERIA_CONFIRMED_COMPLETE:
                    q[i]['displayName'] = Consts.DISPLAY_QUERY_CRITERIA_CONFIRMED_COMPLETE;
                    if( q[i]['data'] === 0 ){
                        q[i]['displayData'] = 'Yes';
                    }else if( q[i]['data'] === 1 ){
                        q[i]['displayData'] = 'No';
                    }

                    break;
                case Consts.QUERY_CRITERIA_SUBJECT_ID:
                    q[i]['displayName'] = Consts.DISPLAY_QUERY_CRITERIA_SUBJECT_ID;
                    q[i]['displayData'] = [];
                    for( let f = 0; f < q[i]['data'].length; f++ ){
                        q[i]['displayData'].push( q[i]['data'][f] );
                    }
                    break;

                case Consts.QUERY_CRITERIA_MOST_RECENT_SUBMISSION:
                    q[i]['displayName'] = Consts.DISPLAY_QUERY_CRITERIA_MOST_RECENT_SUBMISSION;
                    q[i]['displayData'] = q[i]['data'].replace( /-/g, '/' ).replace( /,/, ' to ' );
                    break;
            }
        }
        return q;
    }

    /**
     * The "Clear" button on the left side of the Display query.
     */
    onClearQueryClick() {
        this.displayQueryService.clearQuerySectionQuery();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
