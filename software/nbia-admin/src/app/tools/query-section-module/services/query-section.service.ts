import { EventEmitter, Injectable } from '@angular/core';
import { UtilService } from '../../../admin-common/services/util.service';
import { DisplayQueryService } from '../../display-query-module/display-query/display-query.service';

@Injectable( {
    providedIn: 'root'
} )
export class QuerySectionService{

    queryData = [];

    updatedQueryEmitter = new EventEmitter();

    constructor( private utilService: UtilService, private displayQueryService: DisplayQueryService ) {
    }


    updateQuery( tool, criteria, data ) {
        console.log('MHL updateQuery tool: ', tool);
        console.log('MHL updateQuery criteria: ', criteria);
        console.log('MHL updateQuery data: ', data);
        // Do we have this criteria yet?
        let i = this.entryExists( tool, criteria );
        if( i >= 0 ){
            if( this.utilService.isNullOrUndefinedOrEmpty( data ) && (typeof data !== 'number') ){
                this.deleteFromQueryArray( i )
            }else{
                this.updateToQueryArray( i, data );
            }

        }else{
            if( ! this.utilService.isNullOrUndefined( data ) ){
                this.addToQueryArray( { tool, criteria, data } );
            }
        }

        this.displayQueryService.query( this.queryData );


        console.log('MHL this.queryData: ', this.queryData);
        // Tell anyone who is subscribing, there is a new query.
        this.updatedQueryEmitter.emit( this.queryData);
    }


    addToQueryArray( qData ) {
        this.queryData.push( qData );
    }

    updateToQueryArray( i, qData ) {
        this.queryData[i]['data'] = qData;
    }

    deleteFromQueryArray( i ) {
        this.queryData.splice( i, 1 );
    }

    getQuery(){
        return this.queryData;
    }

    entryExists( tool, criteria ) {
        for( let i = 0; i < this.queryData.length; i++ ){
            if(
                (this.queryData[i]['tool'].localeCompare( tool ) === 0) &&
                ((this.queryData[i]['criteria'].localeCompare( criteria ) === 0)) ){
                return i;
            }
        }
        return -1;
    }

}
