import { Injectable } from '@angular/core';
import { DynamicCriteriaQueryPart } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-criteria-query-part';
import { WIDGET_TYPE } from '@app/tools/query-section-module/dynamic-query-criteria/widget/widget.component';

@Injectable( {
    providedIn: 'root'
} )
export class DynamicQueryBuilderService{
    dynamicCriteriaPartList: DynamicCriteriaQueryPart[] = [];
    counter = 0;

    constructor() {
    }

    getQueryPartList() {
        return this.dynamicCriteriaPartList;
    }

    getQueryPartCount(): number {
        return this.dynamicCriteriaPartList.length;
    }

    addCriteriaQueryPart( part: DynamicCriteriaQueryPart ) {
        console.log( 'MHL addCriteriaQueryPart part: ', part );
        let havePart = false;

        for( let f = 0; f < this.dynamicCriteriaPartList.length; f++ ){
            if( this.dynamicCriteriaPartList[f].criteriaType === part.criteriaType && this.dynamicCriteriaPartList[f].inputType === part.inputType ){
                this.dynamicCriteriaPartList.splice( f, 1, part );
                havePart = true;
            }
        }
        if( !havePart ){
            this.dynamicCriteriaPartList.push( part );
        }

        console.log( 'MHL QUERY: ', this.buildServerQuery() );
    }

    deleteCriteriaQueryPart( part: DynamicCriteriaQueryPart ) {
        for( let f = 0; f < this.dynamicCriteriaPartList.length; f++ ){
            if( this.dynamicCriteriaPartList[f].criteriaType === part.criteriaType && this.dynamicCriteriaPartList[f].inputType === part.inputType ){
                this.dynamicCriteriaPartList.splice( f, 1 );
            }
        }
    }

    buildServerQuery(): string {
        let serverQuery = '';
        this.counter = 0;
        for( let f = 0; f < this.dynamicCriteriaPartList.length; f++ ){
            console.log( 'MHL buildServerQuery dynamicCriteriaPartList[' + f + ']:', this.dynamicCriteriaPartList[f] );
            serverQuery += this.buildServerQueryPart( this.dynamicCriteriaPartList[f] );
        }

        // Remove last "&"
        serverQuery = serverQuery.slice( 0, -1 );

        return serverQuery;
    }

    buildServerQueryPart( widget ) {
        console.log( 'MHL 00 buildServerQueryPart: ', WIDGET_TYPE[widget.widgetType] );
        let serverQueryPart = '';
        switch( widget.widgetType ){

            case WIDGET_TYPE.NUMBER:
                console.log( 'MHL 01 buildServerQueryPart: ', widget.userInput );
                serverQueryPart += 'criteriaType' + this.counter + '=' + widget['criteriaType'] +
                    '&inputType' + this.counter + '=' + widget['inputType'] +
                    '&value' + this.counter + '=' + widget.userInput[0];
                serverQueryPart += '&';
                this.counter++;
                break;

            case WIDGET_TYPE.TEXT:
                console.log( 'MHL 02 buildServerQueryPart: ', widget.userInput );
                serverQueryPart += 'criteriaType' + this.counter + '=' + widget['criteriaType'] +
                    '&inputType' + this.counter + '=' + widget['inputType'] +
                    '&value' + this.counter + '=' + widget.userInput[0];
                serverQueryPart += '&';
                this.counter++;

                break;

            case WIDGET_TYPE.ITEM_LIST:
                console.log( 'MHL 03 buildServerQueryPart: ', widget.userInput );
                for( let part of widget.userInput ){
                    serverQueryPart += 'criteriaType' + this.counter + '=' + widget['criteriaType'] +
                        '&inputType' + this.counter + '=' + widget['inputType'] +
                        '&value' + this.counter + '=' + part;
                    serverQueryPart += '&';
                    this.counter++;
                }
                break;

            case WIDGET_TYPE.ONE_LINE_RADIO_BUTTONS:
                console.log( 'MHL 04 buildServerQueryPart: ', widget.userInput );
                break;

            case WIDGET_TYPE.ONE_CHECKBOX:
                console.log( 'MHL 05 buildServerQueryPart: ', widget.userInput );
                break;

            case WIDGET_TYPE.CALENDAR:
                console.log( 'MHL 06 buildServerQueryPart: ', widget.userInput );
                for( let part of widget.userInput ){
                    serverQueryPart += 'criteriaType' + this.counter + '=' + widget['criteriaType'] +
                    '&inputType' + this.counter + '=' + widget['inputType'] +
                    '&value' + this.counter + '=';
                    serverQueryPart +=  (part.length > 0) ? part : 'NONE';
                    serverQueryPart += '&';
                    this.counter++;
                }
                break;
        }
        return serverQueryPart;
    }


}
