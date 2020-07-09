import { EventEmitter, Injectable } from '@angular/core';
import { UtilService } from '@app/admin-common/services/util.service';
import { DisplayQueryService } from '../../display-query-module/display-query/display-query.service';

@Injectable( {
    providedIn: 'root'
} )
export class QuerySectionService{

    queryData = [];

    updatedQueryEmitter = new EventEmitter();
    rerunCurrentQueryEmitter = new EventEmitter();

    /**
     * For Edit Collection Description.
     */
    updateCollectionEmitter = new EventEmitter();

    /**
     * Criteria Search or Text Search.
     */
    searchType = 0;
    updateSearchTypeEmitter = new EventEmitter();


    constructor( private utilService: UtilService, private displayQueryService: DisplayQueryService ) {
    }

    rerunCurrentQuery(){
        this.rerunCurrentQueryEmitter.emit();
    }

    updateSearchQuery( tool, criteria, data ) {
        // Do we have this criteria yet?
        let i = this.entryExists( tool, criteria );

        // It exists and must be changed
        if( i >= 0 ){
            if( this.utilService.isNullOrUndefinedOrEmpty( data ) && (typeof data !== 'number') ){
                this.deleteFromQueryArray( i )
            }else{
                this.updateToQueryArray( i, data );
            }
        // It dose not exist in the query array, so add it.
        }else{
            if( ! this.utilService.isNullOrUndefined( data ) ){
                this.addToQueryArray( { tool, criteria, data } );
            }
        }

        this.displayQueryService.query( this.queryData );
        // Tell anyone who is subscribing, there is a new query.
        this.updatedQueryEmitter.emit( this.queryData);
    }

    emitCollection( collection ){
        this.updateCollectionEmitter.emit( collection );
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

    /**
     * Criteria Search or Text Search
     */
    setSearchType( t ){
        if( this.searchType !== t ){
            this.searchType = t;
            this.updateSearchTypeEmitter.emit( this.searchType );
        }
    }

}
