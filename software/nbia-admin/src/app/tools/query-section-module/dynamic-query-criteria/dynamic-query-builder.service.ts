import { Injectable } from '@angular/core';
import { DynamicCriteriaQueryPart } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-criteria-query-part';
import { WIDGET_TYPE } from '@app/tools/shared/enums/widget-type.enum';
import { ApiService } from '@app/admin-common/services/api.service';
import { ParameterService } from '@app/admin-common/services/parameter.service';
import { Consts } from '@app/constants';
import { UtilService } from '@app/admin-common/services/util.service';

@Injectable( {
    providedIn: 'root'
} )
export class DynamicQueryBuilderService{
    dynamicCriteriaPartList: DynamicCriteriaQueryPart[] = [];
    counter = 0;

    constructor( private apiService: ApiService, private parameterService: ParameterService,
                 private utilService: UtilService ){
    }

    // This is called when the Master Clear button in the Display Query is clicked
    clearQuery(){
        this.dynamicCriteriaPartList = [];
    }

    getQueryPartList(){
        return this.dynamicCriteriaPartList;
    }

    getQueryPartCount(): number{
        return this.dynamicCriteriaPartList.length;
    }

    // @FIXME - we don't need currenTool parameter anymore
    addCriteriaQueryPart( part: DynamicCriteriaQueryPart, currentTool? ){
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
    async deleteCriteriaQueryPart( criteriaType, inputType, rerunQuery = true ){
        await this.utilService.sleep( 300 );// TESTING  THIS is a workaround (please) refactor me. Don't forget to describe this in JIRA
        for( let f = 0; f < this.dynamicCriteriaPartList.length; f++ ){
            if( this.dynamicCriteriaPartList[f].criteriaType === criteriaType && this.dynamicCriteriaPartList[f].inputType === inputType ){
                this.dynamicCriteriaPartList.splice( f, 1 );
            }
        }
        if( rerunQuery ){
            this.apiService.doAdvancedQcSearch( this.buildServerQuery() );
        }
    }

    buildServerQuery(): string{
        let serverQuery = '';
        this.counter = 0;
        for( let f = 0; f < this.dynamicCriteriaPartList.length; f++ ){
            serverQuery += this.buildServerQueryPart( this.dynamicCriteriaPartList[f] );
        }

        if( this.parameterService.getCurrentTool() === Consts.TOOL_APPROVE_DELETIONS ){

            serverQuery += 'criteriaType' + this.counter + '=qcstatus' +
                '&inputType' + this.counter + '=list' +
                '&boolean' + this.counter + '=AND' +
                '&value' + this.counter + '=To Be Deleted';

        }else{
            // Remove last "&"
            serverQuery = serverQuery.slice( 0, -1 );
        }

        return serverQuery;
    }

    buildServerQueryPart( widget ){
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
                serverQueryPart += '&value' + this.counter + '=' + widget.userInput[0];
                serverQueryPart += '&';
                this.counter++;
                break;

            case WIDGET_TYPE.ONE_CHECKBOX:
                // console.log( 'MHL 05 buildServerQueryPart: ', widget.userInput );
                break;

            case WIDGET_TYPE.CALENDAR:
                serverQueryPart = '';

                for( let part of widget.userInput ){
                    if( part === '' ){
                        break;
                    }
                    serverQueryPart += 'criteriaType' + this.counter + '=' + widget['criteriaType'] +
                        '&inputType' + this.counter + '=' + widget['inputType'] +
                        '&boolean' + this.counter + '=' + widget['andOr'] +
                        '&value' + this.counter + '=';
                    serverQueryPart += (part.length > 0) ? part : '';
                    serverQueryPart += '&';
                    this.counter++;

                }
                break;
        }
        return serverQueryPart;
    }


}
