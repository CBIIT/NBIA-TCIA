// ---------------------------------------------------------------------------------------------------
// -----   This class will be passed from the individual Widgets to the Dynamic query builder    -----
// ---------------------------------------------------------------------------------------------------

import { WIDGET_TYPE } from '@app/tools/query-section-module/dynamic-query-criteria/widget/widget.component';

/**
 * When a Dynamic criteria is added or modified, it will pass its data to the dynamic-query-builder.service as one of these.
 * The dynamic-query-builder.service will maintain the list of these and initiate the query calls to the server
 */
export class DynamicCriteriaQueryPart{

    /**
     * This will be used to help generate rest call parameters .
     * <ul>
     *     <li> UNKNOWN
     *     <li> NUMBER
     *     <li> TEXT
     *     <li> ITEM_LIST
     *     <li> ONE_LINE_RADIO_BUTTONS
     *     <li> ONE_CHECKBOX
     *     <li> CALENDAR
     *  </usl>
     */
    widgetType: WIDGET_TYPE;

    /**
     * An ordered list of the users input(s) within the widget.
     */
    userInput: any[] = [];

    /**
     * This was provided by the server.
     * It is used as part of the query so the server knows which criteria this part of the query comes from.
     */
    criteriaType: string = '';

    /**
     * This was provided by the server.
     * It is used as part of the query so the server knows how to parse "userInput"
     */
    inputType: string = '';

    /**
     * This is the And or Or that the user selected when they added this criteria.
     */
    andOr: string = '';


    constructor( widgetType: WIDGET_TYPE, userInput: any[], criteriaType: string, inputType: string, andOr: string ) {
        this.widgetType = widgetType;
        this.userInput = userInput;
        this.criteriaType = criteriaType;
        this.inputType = inputType;
        this.andOr = andOr;
    }

    toString(): string {
        let data = '{' +
            '"userInput": [';
        for( let input of this.userInput ){
            data += input + ',';
        }
        data += ']' +
            '"inputType": ' + this.inputType +
            '"criteriaType": ' + this.criteriaType +
            '"andOr": ' + this.andOr +
            '}';
        return data;
    }
}
