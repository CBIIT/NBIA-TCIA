import {Component, Input, OnInit} from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';

@Component({
  selector: 'nbia-third-party-explanation',
  templateUrl: './third-party-explanation.component.html',
  styleUrls: ['./third-party-explanation.component.scss']
})
export class ThirdPartyExplanationComponent implements OnInit {

  @Input() posY;

  constructor( private commonService: CommonService) { }

  ngOnInit() {
  }


    onThirdPartyExplanationCloseClick(){
        this.commonService.setShowThirdPartyExplanation(false);

    }
}
