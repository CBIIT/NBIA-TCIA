import { Component, OnInit } from '@angular/core';
import { DynamicQueryCriteriaService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service';


export const AndOrTypes = {
    AND_OR: 'andOr',  // Radio buttons
    ONLY_AND: 'onlyAnd', // Just display
    ONLY_OR: 'onlyOr', // Just display
    NONE: 'none' // Do nothing, show nothing
}


export const DynamicQueryCriteriaTypes = {
    LARGE_TEXT_INPUT: 'largeTextInput',
    SMALL_TEXT_INPUT: 'smallTextInput',
    DATE_RANGE: 'dateRange',
    LIST_MULTIPLE_SELECTION: 'listMultipleSelection',
    TWO_LEVEL_MULTIPLE_SELECTION: 'twoLevelMultipleSelection',
    LIST_ONE_SELECTION: 'listOneSelection',
    SINGLE_CHECKBOX: 'singleCheckbox'
}


@Component( {
    selector: 'nbia-dynamic-query-criteria',
    templateUrl: './dynamic-query-criteria.component.html',
    styleUrls: ['./dynamic-query-criteria.component.scss']
} )

export class DynamicQueryCriteriaComponent implements OnInit{
    queryCriteriaType = null;
    queryCriteriaData = [];

    queryCriteriaCount = 0;
    dynamicQueryCriteriaTypes = DynamicQueryCriteriaTypes;

  //  constructor( private dynamicQueryCriteriaService: DynamicQueryCriteriaService ) {
    constructor(  ) {
    }

    ngOnInit() {
        this.sendTestData();
    }

    /**
     * This is where the call to the server to get back a query criteria will go
     */
    async sendTestData() {
        //

        let temp;

        //       temp = this.dynamicQueryCriteriaService.getDynamicQueryCriteriaSmallTextInput();
        // await this.utilService.sleep( 5000 );
        //       this.addQueryCriteria( temp );

/*


        temp = this.dynamicQueryCriteriaService.getDynamicTwoLevelMultiChoiceList();
        this.addQueryCriteria( temp );
        console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);

        temp = this.dynamicQueryCriteriaService.getDynamicQueryCriteriaSingleCheckbox();
        this.addQueryCriteria( temp );
        console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);

        temp = this.dynamicQueryCriteriaService.getDynamicMultiChoiceList();
        this.addQueryCriteria( temp );
        console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);

        temp = this.dynamicQueryCriteriaService.getDynamicSingleChoiceList();
        this.addQueryCriteria( temp );
        console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);

        temp = this.dynamicQueryCriteriaService.getDynamicQueryCriteriaLargeTextInput();
        this.addQueryCriteria( temp );
        console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);

        temp = this.dynamicQueryCriteriaService.getDynamicQueryCriteriaSmallTextInput();
        this.addQueryCriteria( temp );
        console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);

        temp = this.dynamicQueryCriteriaService.getDynamicQueryCriteriaDateRange();
        this.addQueryCriteria( temp );

        console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);

*/
    }

    addQueryCriteria( qCriteriaData ) {
        this.queryCriteriaData.push( qCriteriaData );
        this.queryCriteriaCount = this.queryCriteriaData.length;
        this.queryCriteriaType = qCriteriaData.dynamicQueryCriteria;
        console.log( 'MHL 101 DynamicQueryCriteriaComponent queryCriteriaType: ', this.queryCriteriaType );
        console.log( 'MHL 102 DynamicQueryCriteriaComponent queryCriteriaType: ', this.queryCriteriaData );
    }
}
