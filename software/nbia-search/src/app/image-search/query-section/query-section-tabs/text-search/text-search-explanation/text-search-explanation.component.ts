import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Properties } from '@assets/properties';

@Component({
  selector: 'nbia-text-search-explanation',
  templateUrl: './text-search-explanation.component.html',
  styleUrls: ['./text-search-explanation.component.scss']
})
export class TextSearchExplanationComponent implements OnInit {

    properties = Properties;

    constructor( private commonService: CommonService ) { }


  ngOnInit() {
  }


    onExplanationCloseClick(){
        this.commonService.setShowTextExplanation( false );
    }
}
