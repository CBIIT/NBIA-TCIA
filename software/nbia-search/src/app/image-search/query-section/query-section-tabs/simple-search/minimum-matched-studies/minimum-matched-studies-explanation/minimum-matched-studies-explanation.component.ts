import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '@app/image-search/services/common.service';

@Component({
  selector: 'nbia-minimum-matched-studies-explanation',
  templateUrl: './minimum-matched-studies-explanation.component.html',
  styleUrls: ['./minimum-matched-studies-explanation.component.scss']
})
export class MinimumMatchedStudiesExplanationComponent implements OnInit {
  @Input() posY;

  constructor( private commonService: CommonService) { }

  ngOnInit() {
  }

  onMinimumMatchedStudiesExplanationCloseClick(){
    this.commonService.setShowMinimumMatchedStudiesExplanation( false);
  }

}
