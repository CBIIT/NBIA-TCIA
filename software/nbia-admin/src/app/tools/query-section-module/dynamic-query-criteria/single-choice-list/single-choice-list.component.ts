import { Component, Input, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { ResizedEvent } from 'angular-resize-event';


@Component({
  selector: 'nbia-single-choice-list',
  templateUrl: './single-choice-list.component.html',
  styleUrls: ['./single-choice-list.component.scss', '../../left-section/left-section.component.scss']
})

export class SingleChoiceListComponent implements OnInit {
    @Input() queryCriteriaData;
    sequenceNumber = -1;
    singleChoiceListShowCriteria = true;
    cBox = [];
    width: number;
    height: number;
    showListSearch = false;
    listSearchInput = '';

    constructor() { }

  ngOnInit() {
        // For unit testing
      if( this.queryCriteriaData === undefined ){
          this.queryCriteriaData = [];
          this.queryCriteriaData['dynamicQueryCriteriaDataArray'] = 0;
          console.error('MHL Code is running that is just for Unit tests! ');
      }

          this.sequenceNumber = this.queryCriteriaData['sequenceNumber'];
          this.init(this.queryCriteriaData['dynamicQueryCriteriaDataArray'] );
   }

  init( data ){

      let maxInitialCountHeight = 10;
          maxInitialCountHeight = 16;
      // Set height to show all collections, or maxInitialCountHeight collections, which ever is less.
      let h = Math.min(data.length, maxInitialCountHeight) * 26;
      document.getElementById('collections').style.height = h + 'px';
  }


    onResized( event: ResizedEvent ) {
        this.width = event.newWidth;
        this.height = event.newHeight;
    }

    onShowCriteriaClick( state ) {
        this.singleChoiceListShowCriteria = state;
    }



    onRemoveCriteriaClick() {
        console.log( 'MHL nbia-single-choice-list: onRemoveCriteriaClick' );
    }

    onSearchGlassClick(){
        console.log( 'MHL nbia-single-choice-list: onSearchGlassClick' );
        this.showListSearch = (!this.showListSearch);   }

    onCriteriaClicked(i){
      console.log('MHL single-choice-list onCriteriaClicked: ', i);
    }

    onSearchTextOutFocus(n){
        console.log('MHL onSearchTextOutFocus: ', n);
    }

    onSearchTextFocus(n){
        console.log('MHL onSearchTextFocus: ', n);
    }

    onSearchChange(e){
        console.log('MHL onSearchChange: ', e);
    }
}
