import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PreferencesService} from "@app/preferences/preferences.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";


@Component({
  selector: 'nbia-single-checkbox',
  templateUrl: './single-checkbox.component.html',
  styleUrls: ['./single-checkbox.component.scss', '../../left-section/left-section.component.scss']
})

export class SingleCheckboxComponent implements OnInit, OnDestroy {
    @Input() queryCriteriaData = {};
    sequenceNumber = -1;
    boxIsChecked = false;
    currentFont;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private preferencesService: PreferencesService) { }

  ngOnInit() {
      this.sequenceNumber = this.queryCriteriaData['sequenceNumber'];
      if( this.queryCriteriaData['dynamicQueryCriteriaDefaultOn']){
          this.boxIsChecked = true;
      }
      else{
          this.boxIsChecked = false;
      }

      // Get font size when it changes
      this.preferencesService.setFontSizePreferencesEmitter
          .pipe( takeUntil( this.ngUnsubscribe ) )
          .subscribe( ( data ) => {
              console.log( 'MHL FONT data: ', data );
              this.currentFont = data;
          } );
      // Get the initial font size value
      this.currentFont = this.preferencesService.getFontSize();

  }

    onCheckboxClick(e){
      console.log('MHL onCheckboxClick: ', e );
    }

    onRemoveCriteriaClick() {
        console.log( 'MHL nbia-large-text-input: onRemoveCriteriaClick' );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
