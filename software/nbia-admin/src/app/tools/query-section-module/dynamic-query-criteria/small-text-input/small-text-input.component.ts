import { Component, Input, OnInit } from '@angular/core';
import { AndOrTypes } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';


@Component({
  selector: 'nbia-small-text-input',
  templateUrl: './small-text-input.component.html',
  styleUrls: ['./small-text-input.component.scss', '../../left-section/left-section.component.scss']
})

export class SmallTextInputComponent implements OnInit {
    @Input() queryCriteriaData;
    sequenceNumber = -1;
    andOrTypes = AndOrTypes;
    criteriaSmallTextInputShowCriteria = true;
    criteriaSmallTextInputText = '';

  constructor() { }

  ngOnInit() {
      this.sequenceNumber = this.queryCriteriaData['sequenceNumber'];
  }


    onShowCriteriaClick( state ) {
        this.criteriaSmallTextInputShowCriteria = state;
    }

    onClearClick() {
        console.log( 'MHL nbia-small-text-input: onClearClick' );
        this.criteriaSmallTextInputText = '';
    }

    onApplyCriteriaClick() {
        console.log( 'MHL nbia-small-text-input: onApplyCriteriaClick' );
    }

    onRemoveCriteriaClick() {
        console.log( 'MHL nbia-small-text-input: onRemoveCriteriaClick' );
    }


}
