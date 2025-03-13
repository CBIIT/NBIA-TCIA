import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '@app/image-search/services/common.service';

@Component({
  selector: 'nbia-images-slice-thickness-explanation',
  templateUrl: './images-slice-thickness-explanation.component.html',
  styleUrls: ['./images-slice-thickness-explanation.component.scss']
})
export class ImagesSliceThicknessExplanationComponent implements OnInit {
  @Input() posY;

  constructor( private commonService: CommonService) { }

  ngOnInit() {
  }

  onImagesSliceThicknessExplanationCloseClick(){
    this.commonService.setShowSliceThicknessRangeExplanation( false);
  }

}
