import { Component, Input, OnInit } from '@angular/core';
import {CommonService} from '@app/image-search/services/common.service';
@Component({
  selector: 'nbia-collection-program-query-explanation',
  templateUrl: './collection-program-query-explanation.component.html',
  styleUrl: './collection-program-query-explanation.component.scss'
})
export class CollectionProgramQueryExplanationComponent implements OnInit {
  @Input() posY;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
  }

  onCollectionProgramQueryExplanationCloseClick(){
    this.commonService.setShowCollectionProgramQueryExplanation( false);
  }
  onCollectionProgramQueryExplanationClick(){
  }

}
