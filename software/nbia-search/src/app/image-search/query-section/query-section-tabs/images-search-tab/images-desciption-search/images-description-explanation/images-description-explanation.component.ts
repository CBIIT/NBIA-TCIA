import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '@app/image-search/services/common.service';

@Component({
  selector: 'nbia-images-description-explanation',
  templateUrl: './images-description-explanation.component.html',
  styleUrls: ['./images-description-explanation.component.scss']
})
export class ImagesDescriptionExplanationComponent implements OnInit {
  @Input() posY;

  constructor( private commonService: CommonService) { }

  ngOnInit() {
  }

  onImagesDescriptionExplanationCloseClick(){
    this.commonService.setShowImageDescriptionExplanation( false);
  }

}
