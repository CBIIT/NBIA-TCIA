import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMyDateModel, INgxMyDpOptions } from 'ngx-mydatepicker';

@Component( {
    selector: 'nbia-widget-calendar',
    templateUrl: './widget-calendar.component.html',
    styleUrls: ['./widget-calendar.component.scss']
} )
export class WidgetCalendarComponent implements OnInit{

    @Input() prompt0;
    @Input() prompt1;
    @Input() placeHolder0;
    @Input() placeHolder1;
    @Input() date0;
    @Output() date0Change: EventEmitter<{}> = new EventEmitter();
    @Input() date1 = {};
    @Output() date1Change: EventEmitter<{}> = new EventEmitter();

    @Input() haveInput: boolean;
    @Output() haveInputChange: EventEmitter<{}> = new EventEmitter();

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

    constructor() {
    }

    ngOnInit() {
    }

    onDateChangedDp1( e: IMyDateModel ) {
        console.log('MHL WidgetCalendarComponent.onDateChangedDp1: ', this.haveInput);
        console.log('MHL onDateChangedDp1 e: ', e);
        this.haveInputChange.emit(this.haveInput);
        this.date1Change.emit( e );
    }

    onDateChangedDp0( e: IMyDateModel ) {
        this.haveInput = true;  // @FIXME TESTING ONLY
        console.log('MHL onDateChangedDp0: ', this.haveInput);
        console.log('MHL onDateChangedDp0 e: ', e);
        this.haveInputChange.emit(this.haveInput);
        this.date0Change.emit( e );
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
