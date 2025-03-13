import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '@app/image-search/services/common.service';

@Component({
  selector: 'nbia-subjects-age-explanation',
  templateUrl: './subjects-age-explanation.component.html',
  styleUrls: ['./subjects-age-explanation.component.scss']
})
export class SubjectsAgeExplanationComponent implements OnInit {
  @Input() posY;

  constructor( private commonService: CommonService) { }

  ngOnInit() {
  }

  onSubjectsAgeExplanationCloseClick(){
    this.commonService.setShowPatientAgeRangeExplanation( false);
  }

}
