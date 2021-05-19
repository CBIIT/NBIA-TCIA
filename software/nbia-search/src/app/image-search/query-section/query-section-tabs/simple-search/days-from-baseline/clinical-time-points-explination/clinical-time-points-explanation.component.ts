import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "@app/image-search/services/common.service";

@Component({
  selector: 'nbia-clinical-time-points-explanation',
  templateUrl: './clinical-time-points-explanation.component.html',
  styleUrls: ['./clinical-time-points-explanation.component.scss']
})
export class ClinicalTimePointsExplanationComponent implements OnInit {
  @Input() posY;

  constructor( private commonService: CommonService) { }

  ngOnInit() {
  }

  onClinicalTimePointsExplanationCloseClick(){
    this.commonService.setShowClinicalTimePointsExplanation( false);
  }
}
