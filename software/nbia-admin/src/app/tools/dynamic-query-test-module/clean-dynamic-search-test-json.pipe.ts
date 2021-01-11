import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'cleanDynamicSearchTestJson'
})
export class CleanDynamicSearchTestJsonPipe implements PipeTransform {


    transform(value: string): any {
        if (value === undefined) {
            return null;
        }
        let result: string = value.replace(/"sequenceNumber.*/g, '')
            .replace(/ *"dynamicQueryCriteriaSmallTextInput": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaLargeTextInput": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaMultiChoiceList": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaSingleChoiceList": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaRequired": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaClearButton": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaOpenCloseButton": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaApplyCheckbox": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaApplyButton": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaSearchable": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaSort": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaSingleCheckbox": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaNumber": false.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaSubHeading": "".* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaAndOrType": "NONE",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaAndOrType": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaAndOrDefault": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaAllAnyType": "NONE",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaAllAnyType": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaAllAnyDefault": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaApplyButton": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaApplyText": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaListData": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaSingleLineRadio0": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaSingleLineRadio1": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaSingleLineRadio2": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaCalendarPlaceHolder1": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaCalendarPrompt1": "",.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaSingleLineRadio": false,.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaAllowNoChoice": false,.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaOpenCloseButton": false,.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaSingleCheckboxDefault": false,.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaSingleLineRadioDefault": *-1.* *\n*\r*/g, '')
            .replace(/ *"dynamicQueryCriteriaType":.* *\n*\r*/g, '')
            .replace(/, *\n*\r* *\n*\r*}\ *$/g, '\n}')
        ;

        // Reformat listData as an array
        result = result.replace(/.*"dynamicQueryCriteriaListData":.*/,
            '  "dynamicQueryCriteriaListData": [' +
            '"' + result.replace(/.*"dynamicQueryCriteriaListData":\s*"(.*)".*\n*\r*/sg,
            '$1').replace(/,\s*".*/s, '').replace(/,/g, '","')
            + '],');


        // If there is no andOr, remove andOr default
        if (!result.match(/dynamicQueryCriteriaAndOrType/)) {
            result = result.replace(/ *"dynamicQueryCriteriaAndOrDefault": ".* *\n*\r*/g, '')
        }

        // If there is no Apply button or checkbox, remove apply button text
        if ((!result.match(/dynamicQueryCriteriaApplyButton/)) && (!result.match(/dynamicQueryCriteriaApplyCheckbox/))) {
            result = result.replace(/ *"dynamicQueryCriteriaApplyText":.* *\n*\r*/g, '')
        }

        // If there is no dynamicQueryCriteriaNumber, remove high, low, and default
        if (!result.match(/dynamicQueryCriteriaNumber"/)) {
            result = result.replace(/ *"dynamicQueryCriteriaNumberDefault":.* *\n*\r*/g, '')
            result = result.replace(/ *"dynamicQueryCriteriaNumberLimitHigh":.* *\n*\r*/g, '')
            result = result.replace(/ *"dynamicQueryCriteriaNumberLimitLow":.* *\n*\r*/g, '')
        }
        return result;
    }

}
