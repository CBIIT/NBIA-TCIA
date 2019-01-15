import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Properties } from '../../assets/properties';
import { UtilService } from '../services/util.service';


@Component( {
    selector: 'nbia-images-per-page',
    templateUrl: './images-per-page.component.html',
    styleUrls: ['./images-per-page.component.scss']
} )

export class ImagesPerPageComponent implements OnInit{

    imagesPerPage;

    constructor( private commonService: CommonService, private utilService: UtilService ) {
    }

    ngOnInit() {
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
