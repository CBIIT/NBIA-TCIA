import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'nbia-single-checkbox',
  templateUrl: './single-checkbox.component.html',
  styleUrls: ['./single-checkbox.component.scss', '../../left-section/left-section.component.scss']
})
export class SingleCheckboxComponent implements OnInit {
    @Input() queryCriteriaData;
    sequenceNumber = -1;
    boxIsChecked = false;

  constructor() { }

  ngOnInit() {
      this.sequenceNumber = this.queryCriteriaData['sequenceNumber'];
  }

    onCheckboxClick(e){
      console.log('MHL onCheckboxClick: ', e );
    }

    onRemoveCriteriaClick() {
        console.log( 'MHL nbia-large-text-input: onRemoveCriteriaClick' );
    }

}
