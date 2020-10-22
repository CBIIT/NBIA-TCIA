import { Component, Input, OnInit } from '@angular/core';
import { AndOrTypes } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';


@Component( {
    selector: 'nbia-large-text-input',
    templateUrl: './large-text-input.component.html',
    styleUrls: ['./large-text-input.component.scss', '../../left-section/left-section.component.scss']
} )

export class LargeTextInputComponent implements OnInit{
    @Input() queryCriteriaData = {};
    sequenceNumber = -1;
    andOrTypes = AndOrTypes;
    criteriaLargeTextInputShowCriteria = true;
    criteriaLargeTextInputText = '';
    criteriaLargeTextInputSubheading = 'Enter comma separated Thing(s)';
    criteriaLargeTextInputHeading = 'Large text input';
   // criteriaLargeTextInputApplyButtonText = 'Apply This Criteria';
    // criteriaLargeTextInputAndOrType = this.andOrTypes.AND_OR
    // criteriaLargeTextInputAndOrType = this.andOrTypes.onlyAnd;
    // criteriaLargeTextInputAndOrType = this.andOrTypes.onlyOr;
    //  criteriaLargeTextInputAndOrType = this.andOrTypes.none;

    options = ['And', 'Or'];
    cBox = [];

    constructor() {
        console.log('MHL queryCriteriaData: ', this.queryCriteriaData);
    }

    ngOnInit() {
        this.sequenceNumber = this.queryCriteriaData['sequenceNumber'];
        if( this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'] !== undefined ){
            this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'] = this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'].toUpperCase();
            if( this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'] === 'AND' ){
                console.log('MHL 000 dynamicQueryCriteriaAndOrDefault: ', this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault']);
                this.cBox[0] = true;
                this.cBox[1] = false;
            }
            else if(this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'] === 'OR'){
                console.log('MHL 001 dynamicQueryCriteriaAndOrDefault: ', this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault']);
                this.cBox[0] = false;
                this.cBox[1] = true;
            }
        }

    }

    onShowCriteriaClick( state ) {
        this.criteriaLargeTextInputShowCriteria = state;
    }

    onClearClick() {
        console.log( 'MHL nbia-large-text-input: onClearClick' );
        this.criteriaLargeTextInputText = '';
    }

    onApplyCriteriaClick() {
        console.log( 'MHL nbia-large-text-input: onApplyCriteriaClick' );
    }

    onRemoveCriteriaClick() {
        console.log( 'MHL nbia-large-text-input: onRemoveCriteriaClick' );
    }

    onLargeTextRadioClick(i){
        console.log('MHL onLargeTextRadioClick: ' + i + ':' + this.sequenceNumber) ;
    }
}
