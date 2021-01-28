import {Component, OnDestroy, OnInit} from '@angular/core';
import {DynamicQueryCriteriaTypes} from "@app/constants";
import {DynamicQueryCriteriaService} from "@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {Properties} from "@assets/properties";


// Keep these upper case, we match against them with toUpperCase() to stay case insensitive.
export const AndOrTypes = {
    AND_OR: 'ANDOR',  // Radio buttons
    ONLY_AND: 'ONLYAND', // Just display
    ONLY_OR: 'ONLYOR', // Just display
    NONE: 'NONE' // Do nothing, show nothing
}
// Keep these upper case, we match against them with toUpperCase() to stay case insensitive.
export const AllAnyTypes = {
    ALL_ANY: 'ALLANY',  // Radio buttons
    ONLY_ALL: 'ONLYALL', // Just display
    ONLY_ANY: 'ONLYANY', // Just display
    NONE: 'NONE' // Do nothing, show nothing
}

export const CriteriaTypes = {
    LIST_RADIO: 'LIST_RADIO',
    LIST_CHECKBOX: 'LIST_CHECKBOX',
    TEXT_INPUT_LARGE: 'TEXT_INPUT_LARGE',
    TEXT_INPUT_SMALL: 'TEXT_INPUT_SMALL'
}


@Component({
    selector: 'nbia-dynamic-query-criteria',
    templateUrl: './dynamic-query-criteria.component.html',
    styleUrls: ['./dynamic-query-criteria.component.scss']
})

export class DynamicQueryCriteriaComponent implements OnInit, OnDestroy {
    queryCriteriaType = null;

    // TODO Make this List its own component or maybe class - with a service to access
    queryCriteriaData = [];

    ShowSampleCount = 10;
    queryCriteriaCount = 0;
    dynamicQueryCriteriaTypes = DynamicQueryCriteriaTypes;
    properties = Properties;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(private dynamicQueryCriteriaService: DynamicQueryCriteriaService) {


        this.dynamicQueryCriteriaService.initWidgetEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            async data => {
                this.addQueryCriteria(data);
            });
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
        /*

                temp = this.dynamicQueryCriteriaService.getDynamicQueryWidget();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);
        */

        //       temp = this.dynamicQueryCriteriaService.getDynamicQueryCriteriaSmallTextInput();
        // await this.utilService.sleep( 5000 );
        //       this.addQueryCriteria( temp );


        /*
                // Still working on this one, it will stop everything following it...
                temp = this.dynamicQueryCriteriaService.getDynamicTwoLevelMultiChoiceList();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);
        */


        /*

                temp = this.dynamicQueryCriteriaService.getDynamicQueryWidget1();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);

                temp = this.dynamicQueryCriteriaService.getDynamicQueryWidget2();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);


                temp = this.dynamicQueryCriteriaService.getDynamicMultiChoiceList();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);
                console.log('MHL *** dynamicQueryCriteria Widget data: ' , temp);

                temp = this.dynamicQueryCriteriaService.getDynamicMultiChoiceList1();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);
                console.log('MHL *** dynamicQueryCriteria Widget data: ' , temp);
        */

        /*

                temp = this.dynamicQueryCriteriaService.getDynamicQueryCriteriaSmallTextInput();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);


                temp = this.dynamicQueryCriteriaService.getDynamicQueryCriteriaSingleCheckbox();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);
                temp = this.dynamicQueryCriteriaService.getDynamicMultiChoiceList1();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);
                console.log('MHL *** dynamicQueryCriteria Widget data: ' , temp);


                temp = this.dynamicQueryCriteriaService.getDynamicSingleChoiceList();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);
            */


        /*
                temp = this.dynamicQueryCriteriaService.getDynamicQueryCriteriaLargeTextInput();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);

                temp = this.dynamicQueryCriteriaService.getDynamicQueryCriteriaSmallTextInput();
                this.addQueryCriteria( temp );
                console.log('MHL *** dynamicQueryCriteriaType: ' , temp['dynamicQueryCriteriaType']);

                temp = this.dynamicQueryCriteriaService.getDynamicQueryCriteriaDateRange();
                this.addQueryCriteria( temp );
        */

    }

    addQueryCriteria(qCriteriaData) {

        if(this.queryCriteriaData.length >= this.ShowSampleCount){
            this.queryCriteriaData.pop();
        }
        this.queryCriteriaData.reverse();
        this.queryCriteriaData.push(qCriteriaData);
        this.queryCriteriaData.reverse();
      //  this.queryCriteriaData.push(qCriteriaData);
        this.queryCriteriaCount = this.queryCriteriaData.length;
        this.queryCriteriaType = qCriteriaData.dynamicQueryCriteria;
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
