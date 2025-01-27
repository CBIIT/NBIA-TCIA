import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '@app/image-search/services/common.service';

@Component({
  selector: 'nbia-images-pixel-spacing-explanation',
  templateUrl: './images-pixel-spacing-explanation.component.html',
  styleUrls: ['./images-pixel-spacing-explanation.component.scss']
})
export class ImagesPixelSpacingExplanationComponent implements OnInit {
  @Input() posY;

  constructor( private commonService: CommonService) { }

  ngOnInit() {
  }

  onImagesPixelSpacingExplanationCloseClick(){
    this.commonService.setShowPixelSpacingRangeExplanation( false);
  }

}
