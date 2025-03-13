import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '@app/image-search/services/common.service';

@Component({
  selector: 'nbia-phantom-query-explanation',
  templateUrl: './phantom-query-explanation.component.html',
  styleUrls: ['./phantom-query-explanation.component.scss']
})
export class PhantomQueryExplanationComponent implements OnInit {
  @Input() posY;

  constructor( private commonService: CommonService) { }

  ngOnInit() {
  }

  onPhantomQueryExplanationCloseClick(){
    this.commonService.setShowPhantomQueryExplanation( false);
  }
}
