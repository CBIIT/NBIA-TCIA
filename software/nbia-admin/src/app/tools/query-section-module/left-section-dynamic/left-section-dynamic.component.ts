import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicQueryCriteriaService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service';
import { Properties } from '@assets/properties';
import { Consts } from '@app/constants';

@Component( {
    selector: 'nbia-left-section-dynamic',
    templateUrl: './left-section-dynamic.component.html',
    styleUrls: ['./left-section-dynamic.component.scss']
} )
export class LeftSectionDynamicComponent implements OnInit, OnDestroy{
    @Input() currentTool;
    usedElements = [];
    queryCriteriaData = [];
    consts = Consts;

    testData0 = {
        'dynamicQueryCriteriaClearButton': true,
        'dynamicQueryCriteriaOpenCloseButton': true,
        'dynamicQueryCriteriaHeading': 'Test Widget',
        'dynamicQueryCriteriaSubHeading': 'Sub-heading',
        'dynamicQueryCriteriaApplyButton': true,
        'dynamicQueryCriteriaApplyText': 'Okay',
        'dynamicQueryCriteriaAllowNoChoice': true,
        'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
        'dynamicQueryCriteriaCalendar': true,
        'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
        'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
        'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
        'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD'
    };

    testData1 = {
        'dynamicQueryCriteriaSingleChoiceList': true,
        'dynamicQueryCriteriaClearButton': true,
        'dynamicQueryCriteriaOpenCloseButton': true,
        'dynamicQueryCriteriaHeading': 'Test Widget',
        'dynamicQueryCriteriaSubHeading': 'Sub-heading',
        'dynamicQueryCriteriaApplyButton': true,
        'dynamicQueryCriteriaApplyText': 'Okay',
        'dynamicQueryCriteriaSearchable': true,
        'dynamicQueryCriteriaSort': true,
        'dynamicQueryCriteriaListData': ['Zulu', 'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Fox', 'Golf', 'Hotel', 'India', 'Juliette', 'Kilo', 'Lima', 'Mike', 'November'],
        'dynamicQueryCriteriaAllowNoChoice': true,
        'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
        'dynamicQueryCriteriaCalendar': false,
        'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
        'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
        'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
        'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD'
    };

    testData2 = {

        'dynamicQueryCriteriaAllowNoChoice': true,
        'dynamicQueryCriteriaApplyButton': true,
        'dynamicQueryCriteriaApplyText': 'Okay',
        'dynamicQueryCriteriaCalendar': false,
        'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
        'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
        'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
        'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
        'dynamicQueryCriteriaClearButton': true,
        'dynamicQueryCriteriaHeading': 'Study UID',
        'dynamicQueryCriteriaOpenCloseButton': true,
        'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
        'dynamicQueryCriteriaSingleLineRadioDefault': 2,
        'dynamicQueryCriteriaSmallTextInput': true,
        'dynamicQueryCriteriaSort': true,
        'dynamicQueryCriteriaSubHeading': 'Enter Study UID'
    };

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private dynamicQueryCriteriaService: DynamicQueryCriteriaService ){
    }

    ngOnInit(){
        this.dynamicQueryCriteriaService.addWidgetEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async data => {
                // Add sequenceNumber here
                data['sequenceNumber'] = Properties.dynamicQueryCriteriaSequenceNumber++;

                //
                if( this.currentTool === Consts.TOOL_EDIT_COLLECTION_DESCRIPTIONS ){
                    if( data['dynamicQueryCriteriaHeading'] === 'Collection'){
                        this.addQueryCriteria( data );
                    }
                }else{
                   // console.log('MHL DATA: ', data );
                   // console.log('MHL currentTool: ', this.currentTool );
                    this.addQueryCriteria( data );
                }
            } );

        this.dynamicQueryCriteriaService.deleteWidgetEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async data => {
                this.deleteQueryCriteria( data );
            } );

        /*
                this.dynamicQueryCriteriaService.addWidget( this.testData2 );
                this.dynamicQueryCriteriaService.addWidget( this.testData0 );
                this.dynamicQueryCriteriaService.addWidget( this.testData1 );
        */

    }

    /**
     * Add to top of list.
     *
     * @param qCriteriaData
     */
    addQueryCriteria( qCriteriaData ){
        this.queryCriteriaData.reverse();
        this.queryCriteriaData.push( qCriteriaData );
        this.queryCriteriaData.reverse();
    }

    /**
     * Removes the widget from this.queryCriteriaData list, this removes it from the screen
     * @TODO Remove this criteria's part of the query
     * @TODO Re-enable this choice in the "Select Search Criteria" menu
     *
     * @param qCriteriaData
     */
    deleteQueryCriteria( qCriteriaData ){
        for( let f = 0; f < this.queryCriteriaData.length; f++ ){
            if( (this.queryCriteriaData[f]['criteriaType'] === qCriteriaData['criteriaType']) && (this.queryCriteriaData[f]['inputType'] === qCriteriaData['inputType']) ){
                this.queryCriteriaData.splice( f, 1 );
            }
        }
    }


    ngOnDestroy(): void{
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
