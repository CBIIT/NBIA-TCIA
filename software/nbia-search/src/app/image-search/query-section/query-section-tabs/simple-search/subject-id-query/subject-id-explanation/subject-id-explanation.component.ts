import {Component, Input, OnInit} from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';

@Component({
  selector: 'nbia-subject-id-explanation',
  templateUrl: './subject-id-explanation.component.html',
  styleUrls: ['./subject-id-explanation.component.scss']
})
export class SubjectIdExplanationComponent implements OnInit {

  @Input() posY;

  constructor( private commonService: CommonService) { }

  ngOnInit() {
  }


    onSubjectIdExplanationCloseClick(){
        this.commonService.setShowSubjectIdExplanation(false);

    }
}
