import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Properties } from '../../assets/properties';
import { UtilService } from '../services/util.service';


@Component( {
  selector: 'nbia-images-per-page',
  templateUrl: './images-per-page.component.html',
  styleUrls: ['./images-per-page.component.scss', '../nbia-thumbnail-viewer/nbia-thumbnail-viewer.component.scss']
} )

export class ImagesPerPageComponent implements OnInit{

  imagesPerPage;
  haveData = false;

  constructor( private commonService: CommonService, private utilService: UtilService ) {
  }

  ngOnInit() {
    this.commonService.haveAllDataEmitter.subscribe(
      data => {
        this.haveData = data;
      }
    );


    this.initImagesPerPage();
  }

  onChangeMinimumMatchedStudies() {
    this.commonService.setImagesPerPage( this.imagesPerPage );
  }

  initImagesPerPage() {
    this.imagesPerPage = this.commonService.getPersistedValue( 'imagesPerPage' ); // FIXME this needs to be a const
    if( this.utilService.isNullOrUndefined( this.imagesPerPage ) ){
      this.imagesPerPage = Properties.IMAGES_PER_PAGE_CHOICE_DEFAULT;
    }
    this.commonService.setImagesPerPage( this.imagesPerPage );
  }


}
