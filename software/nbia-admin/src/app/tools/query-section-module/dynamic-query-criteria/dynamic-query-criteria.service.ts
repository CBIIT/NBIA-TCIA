// -------------------------------------------------------------------------------------------
// -----------------------       This is used by the Widget Tester             ---------------
// -------------------------------------------------------------------------------------------



import {EventEmitter, Injectable} from '@angular/core';

import {UtilService} from '@app/admin-common/services/util.service';
import {Properties} from '@assets/properties';
import {DynamicQueryCriteriaTypes} from "@app/constants";

@Injectable({
    providedIn: 'root'
})
export class DynamicQueryCriteriaService {

    initWidgetEmitter = new EventEmitter();

    // I will use these for test values for now
    dynamicQueryCriteria = 'testCriteria';
    dynamicQueryCriteriaType = 'largeTextInput';
    dynamicQueryCriteriaSubHeading = 'The subheading';
    dynamicQueryCriteriaHeading = 'The HeadingXX';
    dynamicQueryCriteriaApplyText = 'ApplyButtonText';
    dynamicQueryCriteriaAndOrType = 'andOr';
    dynamicQueryCriteriaAndOrDefault = 'aNd';
    dynamicQueryCriteriaOpenCloseButton = true;
    dynamicQueryCriteriaInputDelimiter = ',';

    constructor(private utilService: UtilService) {
        //      console.log( 'MHL ** 010 getDynamicQueryCriteriaLargeTextInput: ', this.getDynamicQueryCriteriaLargeTextInput() );
        /*       console.log( 'MHL ** 011 getDynamicQueryCriteriaLargeTextInput: ', this.getDynamicQueryCriteriaLargeTextInput(
                   {
                       'dynamicQueryCriteriaType': AndOrTypes.AND_OR,
                       'dynamicQueryCriteria': 'testCriteria',
                       'dynamicQueryCriteriaHeading': 'The Heading',
                       'dynamicQueryCriteriaSubHeading': 'The subheading',
                       'dynamicQueryCriteriaApplyText': 'ApplyButtonText',
                       'dynamicQueryCriteriaAndOrType': 0
                   }
               ) );
       */
    }



    initWidget( widgetData){
        console.log('MHL initWidget widgetData: ', widgetData);
        this.initWidgetEmitter.emit(widgetData);
    }

    getDynamicQueryWidget(criteriaData?) {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        if (criteriaData !== undefined) {
            criteriaData.sequenceNumber = Properties.dynamicQueryCriteriaSequenceNumber;
            return criteriaData;
        } else {
            let temp = {
                dynamicQueryCriteriaSmallTextInput: true,
                dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.WIDGET,
                dynamicQueryCriteria: 'testWidget',
                dynamicQueryCriteriaRequired: false,
                dynamicQueryCriteriaHeading: 'Test Widget One',
                dynamicQueryCriteriaClearButton: true,
                dynamicQueryCriteriaOpenCloseButton: true,
                dynamicQueryCriteriaSubHeading: 'Test Widget Sub Heading',
                dynamicQueryCriteriaApplyButton: true,
                dynamicQueryCriteriaApplyText: 'Small widgit button',

                /*
                                                      dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.WIDGET,
                                                      dynamicQueryCriteria: 'testWidget',
                                                      dynamicQueryCriteriaRequired: true,
                                                      dynamicQueryCriteriaHeading: 'Test Widget One',
                                                      dynamicQueryCriteriaSubHeading: 'Test Widget Sub Heading',
                                                      dynamicQueryCriteriaOpenCloseButton: true,
                                                      dynamicQueryCriteriaAndOrType: 'onlyAnd',
                                                      dynamicQueryCriteriaAndOrDefault: 'or',
                                                      dynamicQueryCriteriaClearButton: true,
                                                      dynamicQueryCriteriaSearchable: true,
                                                      dynamicQueryCriteriaAllowNoChoice: true,
                                                      dynamicQueryCriteriaSort: true,
                                                      dynamicQueryCriteriaSmallTextInput: false,
                                                      dynamicQueryCriteriaLargeTextInput: false,
                                                      dynamicQueryCriteriaCheckboxArray: ['Zulu', 'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Fox', 'Golf', 'Hotel', 'India', 'Juliette', 'Kilo', 'Lima', 'Mike', 'November'],
                                                      dynamicQueryCriteriaApplyCheckbox: false,
                                                      dynamicQueryCriteriaApplyButton: true,
                                                      dynamicQueryCriteriaApplyText: 'Widget 1 Apply',
                                                                            */
                sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
            };
            return temp;

        }
    }

    getDynamicQueryWidget1(criteriaData?) {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        if (criteriaData !== undefined) {
            criteriaData.sequenceNumber = Properties.dynamicQueryCriteriaSequenceNumber;
            return criteriaData;
        } else {
            let temp = {
                dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.WIDGET,
                dynamicQueryCriteria: 'testWidget',
                dynamicQueryCriteriaRequired: false,
                dynamicQueryCriteriaHeading: 'Test Widget One',
                dynamicQueryCriteriaSubHeading: 'Test Widget Sub Heading',
                dynamicQueryCriteriaOpenCloseButton: false,
                dynamicQueryCriteriaAndOrType: 'onlyAnd',
                dynamicQueryCriteriaAndOrDefault: 'or',

                dynamicQueryCriteriaClearButton: true,

                dynamicQueryCriteriaSearchable: false,

                dynamicQueryCriteriaAllowNoChoice: true,
                dynamicQueryCriteriaSort: true,
                dynamicQueryCriteriaSmallTextInput: false,
                dynamicQueryCriteriaLargeTextInput: false,
                dynamicQueryCriteriaRadioArray: ['Zulu', 'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Fox', 'Golf', 'Hotel', 'India', 'Juliette', 'Kilo', 'Lima', 'Mike', 'November'],
                dynamicQueryCriteriaApplyCheckbox: false,
                dynamicQueryCriteriaApplyButton: true,
                dynamicQueryCriteriaApplyText: 'Widget 1 Apply',

                sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
            };
            return temp;

        }
    }

    getDynamicQueryWidget2(criteriaData?) {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        if (criteriaData !== undefined) {
            criteriaData.sequenceNumber = Properties.dynamicQueryCriteriaSequenceNumber;
            return criteriaData;
        } else {
            let temp = {
                dynamicQueryCriteriaLargeTextInput: true,
                dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.WIDGET,
                dynamicQueryCriteria: 'testWidget',
                dynamicQueryCriteriaRequired: false,
                dynamicQueryCriteriaHeading: 'Test Widget 2',
                dynamicQueryCriteriaClearButton: true,
                dynamicQueryCriteriaOpenCloseButton: true,
                dynamicQueryCriteriaSubHeading: 'LargeTextInput',
                dynamicQueryCriteriaApplyButton: true,

                sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
            };
            return temp;

        }
    }
/*
    getDynamicQueryWidget2(criteriaData?) {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        if (criteriaData !== undefined) {
            criteriaData.sequenceNumber = Properties.dynamicQueryCriteriaSequenceNumber;
            return criteriaData;
        } else {
            let temp = {

                dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.WIDGET,
                dynamicQueryCriteria: 'testWidget',
                // dynamicQueryCriteriaRequired: true,
                dynamicQueryCriteriaHeading: 'Test Widget',
                dynamicQueryCriteriaAllowNoChoice: true,
                // dynamicQueryCriteriaSort: false,
                dynamicQueryCriteriaOpenCloseButton: true,
                dynamicQueryCriteriaSmallTextInput: false,
                dynamicQueryCriteriaLargeTextInput: false,
                dynamicQueryCriteriaCheckboxArray: ['Zulu'],
                sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
            };
            return temp;

        }
    }
*/

    getDynamicQueryCriteriaSmallTextInput(criteriaData?) {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        if (criteriaData !== undefined) {
            criteriaData.sequenceNumber = Properties.dynamicQueryCriteriaSequenceNumber;
            return criteriaData;
        } else {
            let temp = {
                dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.SMALL_TEXT_INPUT,
                dynamicQueryCriteria: 'testCriteriaTypeTwo',
                dynamicQueryCriteriaHeading: 'Small Text Input',
                dynamicQueryCriteriaSubHeading: 'Small Text Input Sub Heading',
                dynamicQueryCriteriaApplyText: 'Small Text Apply',
                dynamicQueryCriteriaOpenCloseButton: true,
                sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
            };
            return temp;

        }
    }

    getDynamicQueryCriteriaSingleCheckbox() {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        let temp = {
            dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.SINGLE_CHECKBOX,
            dynamicQueryCriteriaHeading: 'A single checkbox',
            dynamicQueryCriteria: 'testCriteriaTypeFive',
            dynamicQueryCriteriaDefaultOn: false,
            sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
        };
        return temp;
    }

    getDynamicSingleChoiceList() {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        let temp = {
            dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.LIST_ONE_SELECTION,
            dynamicQueryCriteriaHeading: 'A list, One Selection',
            dynamicQueryCriteriaOpenCloseButton: true,
            dynamicQueryCriteriaClearButton: true,
            dynamicQueryCriteriaAllowNoChoice: true,
            dynamicQueryCriteriaSort: false,
            dynamicQueryCriteriaSearchable: true,
            dynamicQueryCriteria: 'testCriteriaTypeSix',
            dynamicQueryCriteriaCheckboxArray: ['Zulu', 'Yankee', 'Xray', 'Whiskey', 'Victor', 'Uniform', 'Tango', 'Sierra'],

            sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
        };
        return temp;
    }


    getDynamicMultiChoiceList() {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        let temp = {
            dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.LIST_MULTIPLE_SELECTION,
            dynamicQueryCriteriaHeading: 'A Multi selection list',
            dynamicQueryCriteriaOpenCloseButton: true,
            dynamicQueryCriteriaSearchable: true,
            dynamicQueryCriteriaSort: false,
            dynamicQueryCriteriaAndOrType: 'andOr',
            dynamicQueryCriteriaAndOrDefault: 'and',
            dynamicQueryCriteria: 'testCriteriaTypeSeven',
            dynamicQueryCriteriaCheckboxArray: ['Zulu', 'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Fox', 'Golf', 'Hotel', 'India', 'Juliette', 'Kilo', 'Lima', 'Mike', 'November'],
            sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
        };
        return temp;
    }
    getDynamicMultiChoiceList1() {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        let temp = {
            dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.LIST_MULTIPLE_SELECTION,
            dynamicQueryCriteriaHeading: 'QC Status ',
            dynamicQueryCriteriaOpenCloseButton: true,
            dynamicQueryCriteriaSearchable: false,
            dynamicQueryCriteriaSort: false,
            dynamicQueryCriteriaAndOrType: 'and',
            dynamicQueryCriteriaAndOrDefault: 'or',
            dynamicQueryCriteria: 'testCriteriaTypeSeven',
            dynamicQueryCriteriaCheckboxArray: ['Not Yet Reviewed', 'Visible', 'Not Visible',
                'To Be Deleted', 'First Review', 'Second Review', 'Third Review',
                'Fourth Review', 'Fifth Review', 'Sixth Review', 'Seventh Review', 'Downloadable'],

            sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
        };
        return temp;
    }

    getDynamicMultiChoiceList0() {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        let temp = {
            dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.LIST_MULTIPLE_SELECTION,
            dynamicQueryCriteriaHeading: 'A Multi selection list',
            dynamicQueryCriteriaOpenCloseButton: true,
            dynamicQueryCriteriaSearchable: true,
            dynamicQueryCriteriaAndOrType: 'andOr',
            dynamicQueryCriteriaAndOrDefault: 'and',
            dynamicQueryCriteria: 'testCriteriaTypeSeven',
            dynamicQueryCriteriaCheckboxArray: ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Fox', 'Golf', 'Hotel'],


            sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
        };
        return temp;
    }



    getDynamicQueryCriteriaDateRange() {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        let temp = {
            dynamicQueryCriteriaType: 'dateRange',
            dynamicQueryCriteriaHeading: 'Date Range',
            dynamicQueryCriteria: 'testCriteriaTypeThree',
            dynamicQueryCriteriaApplyText: 'Apply Button',
            dynamicQueryCriteriaOpenCloseButton: true,
            dynamicQueryCriteriaAllowOneValue: false,
            sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
        };
        return temp;
    }

    getDynamicTwoLevelMultiChoiceList() {
        console.log('MHL AAgetDynamicTwoLevelMultiChoiceList');
        Properties.dynamicQueryCriteriaSequenceNumber++;
        let temp = {
            dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.TWO_LEVEL_MULTIPLE_SELECTION,
            dynamicQueryCriteriaHeading: 'Two Level Multiple Selection',

            dynamicQueryCriteriaOpenCloseButton: true,
            dynamicQueryCriteriaSearchable: true,
            dynamicQueryCriteriaAndOrType: 'andOr',
            dynamicQueryCriteriaAndOrDefault: 'aNd',
            dynamicQueryCriteria: 'testCriteriaTypeEight',
            dynamicQueryCriteriaCheckboxArray: [
                {
                    'item': 'Alpha',
                    'subItems': ['Alpha One', 'Alpha Two', 'Alpha Three']
                }, {
                    'item': 'Bravo',
                    'subItems': ['Bravo One', 'Bravo Two', 'Bravo Three']
                }, {
                    'item': 'Charlie',
                    'subItems': ['Charlie One', 'Charlie Two', 'Charlie Three']
                }, {
                    'item': 'Delta',
                    'subItems': ['Delta One', 'Delta Two', 'Delta Three']
                }, {
                    'item': 'Echo',
                    'subItems': ['Echo One', 'Echo Two', 'Echo Three']
                }],
            sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
        };
        return temp;
    }




    /**
     * Create a test criteria - Large Text Input.
     * @param criteriaData
     */
    getDynamicQueryCriteriaLargeTextInput(criteriaData?) {
        Properties.dynamicQueryCriteriaSequenceNumber++;

        if (criteriaData !== undefined) {
            criteriaData.sequenceNumber = Properties.dynamicQueryCriteriaSequenceNumber;
            return criteriaData;
        } else {
            let temp = {
                dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.LARGE_TEXT_INPUT,
                dynamicQueryCriteria: this.dynamicQueryCriteria,
                dynamicQueryCriteriaHeading: 'Large Text input',
                dynamicQueryCriteriaSubHeading: this.dynamicQueryCriteriaSubHeading,
                dynamicQueryCriteriaApplyText: this.dynamicQueryCriteriaApplyText,
                dynamicQueryCriteriaAndOrType: this.dynamicQueryCriteriaAndOrType,
                dynamicQueryCriteriaAndOrDefault: this.dynamicQueryCriteriaAndOrDefault,
                dynamicQueryCriteriaOpenCloseButton: this.dynamicQueryCriteriaOpenCloseButton,
                dynamicQueryCriteriaInputDelimiter: this.dynamicQueryCriteriaInputDelimiter,
                sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
            };
            return temp;
        }
    }

}
