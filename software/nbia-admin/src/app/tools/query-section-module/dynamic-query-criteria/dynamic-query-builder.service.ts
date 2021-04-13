import { Injectable } from '@angular/core';
import { DynamicCriteriaQueryPart } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-criteria-query-part';
import { WIDGET_TYPE } from '@app/tools/query-section-module/dynamic-query-criteria/widget/widget.component';
import { ApiService } from '@app/admin-common/services/api.service';
import { DisplayDynamicQueryService } from '@app/tools/display-dynamic-query/display-dynamic-query/display-dynamic-query.service';

@Injectable( {
    providedIn: 'root'
} )
export class DynamicQueryBuilderService{
    dynamicCriteriaPartList: DynamicCriteriaQueryPart[] = [];
    counter = 0;

    constructor( private apiService: ApiService, private displayDynamicQueryService: DisplayDynamicQueryService) {
    }

    getQueryPartList() {
        return this.dynamicCriteriaPartList;
    }

    getQueryPartCount(): number {
        return this.dynamicCriteriaPartList.length;
    }

    addCriteriaQueryPart( part: DynamicCriteriaQueryPart ) {
        let havePart = false;

        for( let f = 0; f < this.dynamicCriteriaPartList.length; f++ ){
            if( this.dynamicCriteriaPartList[f].criteriaType === part.criteriaType && this.dynamicCriteriaPartList[f].inputType === part.inputType ){
                // Swap in the version of this part.
                this.dynamicCriteriaPartList.splice( f, 1, part );
                havePart = true;
            }
        }
        // We dont have anything from this criteria yet, so add this part
        if( !havePart ){
            this.dynamicCriteriaPartList.push( part );
        }

        this.apiService.doAdvancedQcSearch( this.buildServerQuery() );
    }

    /**
     * Remove this part from the list of criteria used to build the query
     *
     * @param criteriaType
     * @param inputType
     * @param rerunQuery  This will be set to false when the "Master Clear" button at the top is clicked.  We need to wait until all widgets are cleared before we do anything with the query.
     */
    deleteCriteriaQueryPart( criteriaType, inputType , rerunQuery = true) {
        console.log('MHL 000 dynamicCriteriaPartList: ', this.dynamicCriteriaPartList);
        for( let f = 0; f < this.dynamicCriteriaPartList.length; f++ ){
            console.log('MHL 001  deleteCriteriaQueryPart criteriaType: ', criteriaType);
            if( this.dynamicCriteriaPartList[f].criteriaType === criteriaType && this.dynamicCriteriaPartList[f].inputType === inputType ){
                this.dynamicCriteriaPartList.splice( f, 1 );
                console.log('MHL 003  deleteCriteriaQueryPart REMOVE criteriaType: ', criteriaType);
            }
        }
        console.log('MHL 004  dynamicCriteriaPartList: ', this.dynamicCriteriaPartList);

   // @FIXME TESTING     if( rerunQuery ){
        if( true ){
            this.apiService.doAdvancedQcSearch( this.buildServerQuery() );
        }
        console.log('MHL 005  dynamicCriteriaPartList: ', this.dynamicCriteriaPartList);
    }

    buildServerQuery(): string {
        let serverQuery = '';
        this.counter = 0;
        for( let f = 0; f < this.dynamicCriteriaPartList.length; f++ ){
            serverQuery += this.buildServerQueryPart( this.dynamicCriteriaPartList[f] );
        }

        // Remove last "&"
        serverQuery = serverQuery.slice( 0, -1 );

        return serverQuery;
    }

    buildServerQueryPart( widget ) {
        let serverQueryPart = 'criteriaType' + this.counter + '=' + widget['criteriaType'] +
            '&inputType' + this.counter + '=' + widget['inputType'] +
            '&boolean' + this.counter + '=' + widget['andOr'];

        switch( widget.widgetType ){

            case WIDGET_TYPE.NUMBER:
                serverQueryPart += '&value' + this.counter + '=' + widget.userInput[0];
                serverQueryPart += '&';
                this.counter++;
                break;

            case WIDGET_TYPE.TEXT:
                serverQueryPart += '&value' + this.counter + '=' + widget.userInput[0];
                serverQueryPart += '&';
                this.counter++;

                break;

            case WIDGET_TYPE.ITEM_LIST:
                serverQueryPart = '';
                for( let part of widget.userInput ){
                    serverQueryPart += 'criteriaType' + this.counter + '=' + widget['criteriaType'] +
                        '&inputType' + this.counter + '=' + widget['inputType'] +
                        '&boolean' + this.counter + '=' + widget['andOr'] +
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
                serverQueryPart = '';

                console.log('MHL widget.userInput: ', widget.userInput);

                for( let part of widget.userInput ){
                    console.log('MHL part: ', part);
                    if( part === '' )
                    {
                        break;
                    }
                    serverQueryPart += 'criteriaType' + this.counter + '=' + widget['criteriaType'] +
                        '&inputType' + this.counter + '=' + widget['inputType'] +
                        '&boolean' + this.counter + '=' + widget['andOr'] +
                        '&value' + this.counter + '=';
                    serverQueryPart += (part.length > 0) ? part : '';
                    serverQueryPart += '&';
                    this.counter++;

                    console.log('MHL serverQueryPart: ', serverQueryPart);

                }
                break;
        }
        return serverQueryPart;
    }


}
