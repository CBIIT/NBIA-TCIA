import { Injectable } from '@angular/core';
/*
import {
    AndOrTypes,
    DynamicQueryCriteriaTypes
} from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
*/
import { UtilService } from '@app/admin-common/services/util.service';
import { Properties } from '@assets/properties';

@Injectable( {
    providedIn: 'root'
} )
export class DynamicQueryCriteriaService{

    // I will use these for test values for now
    dynamicQueryCriteria = 'testCriteria';
    dynamicQueryCriteriaType = 'largeTextInput';
    dynamicQueryCriteriaSubheading = 'The subheading';
    dynamicQueryCriteriaHeading = 'The Heading';
    dynamicQueryCriteriaApplyButtonText = 'ApplyButtonText';
    dynamicQueryCriteriaAndOrType = 'andOr';
    dynamicQueryCriteriaAndOrDefault = 'aNd';
    dynamicQueryCriteriaOpenCloseButton = true;
    dynamicQueryCriteriaInputDelimiter = ',';

    constructor( private utilService: UtilService ) {
        //      console.log( 'MHL ** 010 getDynamicQueryCriteriaLargeTextInput: ', this.getDynamicQueryCriteriaLargeTextInput() );
        /*       console.log( 'MHL ** 011 getDynamicQueryCriteriaLargeTextInput: ', this.getDynamicQueryCriteriaLargeTextInput(
                   {
                       'dynamicQueryCriteriaType': AndOrTypes.AND_OR,
                       'dynamicQueryCriteria': 'testCriteria',
                       'dynamicQueryCriteriaHeading': 'The Heading',
                       'dynamicQueryCriteriaSubheading': 'The subheading',
                       'dynamicQueryCriteriaApplyButtonText': 'ApplyButtonText',
                       'dynamicQueryCriteriaAndOrType': 0
                   }
               ) );
       */
    }

    getDynamicQueryCriteriaSmallTextInput( criteriaData? ) {
        Properties.dynamicQueryCriteriaSequenceNumber++;
        if( criteriaData !== undefined ){
            criteriaData.sequenceNumber = Properties.dynamicQueryCriteriaSequenceNumber;
            return criteriaData;
        }else{
            let temp = {
                dynamicQueryCriteriaType: 'smallTextInput',
                dynamicQueryCriteria: 'testCriteriaTypeTwo',
                dynamicQueryCriteriaHeading: 'Small Text Input',
                dynamicQueryCriteriaSubheading: 'Small Text Input Sub Heading',
                dynamicQueryCriteriaApplyButtonText: 'Small Text Input Apply Button',
                dynamicQueryCriteriaOpenCloseButton: true,
                sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
            };
            return temp;

        }
    }

    getDynamicQueryCriteriaDateRange(){
        Properties.dynamicQueryCriteriaSequenceNumber++;
        let temp = {
            dynamicQueryCriteriaType: 'dateRange',
            dynamicQueryCriteriaHeading: 'Date Range',
            dynamicQueryCriteria: 'testCriteriaTypeThree',
            dynamicQueryCriteriaApplyButtonText: 'Apply Button',
            dynamicQueryCriteriaOpenCloseButton: true,
            dynamicQueryCriteriaAllowOneValue: false,
            sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
        };
        return temp;
    }

    getDynamicMultiChoiceList(){
        Properties.dynamicQueryCriteriaSequenceNumber++;
        let temp = {
            dynamicQueryCriteriaType: 'listMultipleSelection',
            dynamicQueryCriteriaHeading: 'A Multi selection list',
            dynamicQueryCriteriaOpenCloseButton: true,
            dynamicQueryCriteriaSearchable: true,
            dynamicQueryCriteriaAndOrType: 'andOr',
            dynamicQueryCriteriaAndOrDefault: 'aNd',
            dynamicQueryCriteria: 'testCriteriaTypeSeven',
            dynamicQueryCriteriaDataArray: [ 'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Fox', 'Golf', 'Hotel'],


            sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
        };
        return temp;
    }

    getDynamicSingleChoiceList(){
        Properties.dynamicQueryCriteriaSequenceNumber++;
        let temp = {
            dynamicQueryCriteriaType: 'listOneSelection',
            dynamicQueryCriteriaHeading: 'A list, One Selection',
            dynamicQueryCriteriaOpenCloseButton: true,
            dynamicQueryCriteriaSearchable: true,
            dynamicQueryCriteria: 'testCriteriaTypeSix',
            dynamicQueryCriteriaDataArray: [ 'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Fox', 'Golf', 'Hotel'],


            sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
        };
        return temp;
    }


    getDynamicQueryCriteriaSingleCheckbox(){
        Properties.dynamicQueryCriteriaSequenceNumber++;
        let temp = {
            dynamicQueryCriteriaType: 'singleCheckbox',
            dynamicQueryCriteriaHeading: 'A single checkbox',
            dynamicQueryCriteria: 'testCriteriaTypeFive',
            sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
        };
        console.log( 'MHL 032 criteriaData: temp: ', temp );
        return temp;
    }


    /**
     * Create a test criteria - Large Text Input.
     * @param criteriaData
     */
    getDynamicQueryCriteriaLargeTextInput( criteriaData? ) {
        console.log( 'MHL 000a dynamicQueryCriteriaSequenceNumber: ', Properties.dynamicQueryCriteriaSequenceNumber );
        Properties.dynamicQueryCriteriaSequenceNumber++;

        console.log( 'MHL 000b dynamicQueryCriteriaSequenceNumber: ', Properties.dynamicQueryCriteriaSequenceNumber );
        if( criteriaData !== undefined ){
            criteriaData.sequenceNumber = Properties.dynamicQueryCriteriaSequenceNumber;
            console.log( 'MHL 001 criteriaData: ', criteriaData );
            return criteriaData;
        }else{
            let temp = {
                dynamicQueryCriteriaType: this.dynamicQueryCriteriaType,
                dynamicQueryCriteria: this.dynamicQueryCriteria,
                dynamicQueryCriteriaHeading: this.dynamicQueryCriteriaHeading,
                dynamicQueryCriteriaSubheading: this.dynamicQueryCriteriaSubheading,
                dynamicQueryCriteriaApplyButtonText: this.dynamicQueryCriteriaApplyButtonText,
                dynamicQueryCriteriaAndOrType: this.dynamicQueryCriteriaAndOrType,
                dynamicQueryCriteriaAndOrDefault: this.dynamicQueryCriteriaAndOrDefault,
                dynamicQueryCriteriaOpenCloseButton: this.dynamicQueryCriteriaOpenCloseButton,
                dynamicQueryCriteriaInputDelimiter: this.dynamicQueryCriteriaInputDelimiter,
                sequenceNumber: Properties.dynamicQueryCriteriaSequenceNumber
            };
            console.log( 'MHL 002 criteriaData: temp: ', temp );
            return temp;
        }
    }

}
