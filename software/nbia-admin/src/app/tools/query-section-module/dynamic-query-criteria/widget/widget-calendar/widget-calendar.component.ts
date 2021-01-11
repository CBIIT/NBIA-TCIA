import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IMyDateModel, INgxMyDpOptions} from "ngx-mydatepicker";

@Component({
  selector: 'nbia-widget-calendar',
  templateUrl: './widget-calendar.component.html',
  styleUrls: ['./widget-calendar.component.scss']
})
export class WidgetCalendarComponent implements OnInit {

    @Input() prompt0;
    @Input() prompt1;
    @Input() placeHolder0;
    @Input() placeHolder1;
    @Input() date0;
    @Output() date0Change: EventEmitter<{}> = new EventEmitter();
    @Input() date1 = {};
    @Output() date1Change: EventEmitter<{}> = new EventEmitter();


    currentFont = 2;
    dateOptions: INgxMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy',
        sunHighlight: true,
        satHighlight: true,
        firstDayOfWeek: 'su',
        markCurrentDay: true,
        selectorHeight: '232px',
        selectorWidth: '295px',
    };

    constructor() { }

  ngOnInit() {

        console.log('MHL prompt0: ', this.prompt0);
        console.log('MHL prompt1: ', this.prompt1);
  }

    onDateChangedDp1( e: IMyDateModel ) {
        console.log('MHL onDateChangedDp1: ', e);
        this.date1Change.emit(e);
    }

    onDateChangedDp0( e: IMyDateModel ) {
        console.log('MHL onDateChangedDp0: ', e);
        this.date0Change.emit(e);

        // We need to do this because "dateChanged" event can happen before the bound variable fromDateModel is updated.
/*
        if( !this.utilService.isNullOrUndefined( e.date ) && e.date.year > 0 ){
            this.fromDateModel = { date: { year: 0, month: 0, day: 0 } };
            this.fromDateModel['date'] = e.date;
        }
        this.validateDateRange();
        this.onApplyCheckboxChange();
*/
    }

    initializeDisableFutureDates() {
        let today = new Date();
        // Add one day
        today = new Date( today.getTime() + (1000 * 60 * 60 * 24) );
        this.dateOptions.disableSince = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
        };
    }


}
