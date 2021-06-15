import { EventEmitter, Injectable } from '@angular/core';
import { UtilService } from '@app/admin-common/services/util.service';

@Injectable( {
    providedIn: 'root'
} )
export class DisplayDynamicQueryService{
    displayDynamicQueryEmitter = new EventEmitter();
    displayNiceDynamicQueryEmitter = new EventEmitter();
    clearDynamicQuerySectionQueryEmitter = new EventEmitter();
    displayDynamicQuery = '';

    displayQueryElements = [];

    constructor( private utilService: UtilService ){
    }

    query( q ){
        this.displayDynamicQueryEmitter.emit( q );
    }

    async removeFromDisplayQuery( sequenceNumber ){
        await this.utilService.sleep( 375 );// TESTING  THIS is a workaround (please) refactor me. Don't forget to describe this in JIRA
        this.displayQueryElements[sequenceNumber] = undefined;
        this.displayNiceDynamicQueryEmitter.emit( this.displayQueryElements );
    }

    updateDisplayQuery( criteriaQueryData ){
        this.displayQueryElements[criteriaQueryData['sequenceNumber']] = criteriaQueryData;
        this.displayQueryElements[criteriaQueryData['sequenceNumber']]['condition'] = this.setCondition( criteriaQueryData );
        this.displayNiceDynamicQueryEmitter.emit( this.displayQueryElements );
    }

    clearQuerySectionQuery(){
        this.clearDynamicQuerySectionQueryEmitter.emit();
        this.displayQueryElements = [];
        this.displayNiceDynamicQueryEmitter.emit( this.displayQueryElements );
    }

    /**
     * Try to determine from the sub-heading: Less than, greater than, etc.
     * @param criteriaQueryData
     */
    setCondition( criteriaQueryData ){
        let subHead = ''
        if( criteriaQueryData['criteriaSubheading'] !== undefined ){
            subHead = criteriaQueryData['criteriaSubheading'];
        }

        if( subHead.match( /^\s*contains\s*/i ) ){
            return 'Contains';
        }
        if( subHead.match( /^\s*starts \s*with\s*/i ) ){
            return 'Starts with';
        }

        if( subHead.match( /^\s*less \s*than\s*/i ) ){
            return '<';
        }

        if( subHead.match( /^\s*greater \s*than\s*/i ) ){
            return '>';
        }
        return '';
    }
}
