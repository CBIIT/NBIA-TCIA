import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMyDateModel, INgxMyDpOptions } from 'ngx-mydatepicker';
import { WidgetCalendarService } from '@app/tools/query-section-module/dynamic-query-criteria/widget/widget-calendar/widget-calendar.service';

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

    constructor( private widgetCalendarService: WidgetCalendarService) {
    }

    ngOnInit() {
    }

    onDateChangedDp1( e: IMyDateModel ) {
        // @TODO explain 2 emits
        this.haveInputChange.emit(this.haveInput);
        this.date1Change.emit( e );
        this.widgetCalendarService.dateChanged();
    }

    onDateChangedDp0( e: IMyDateModel ) {
        this.haveInput = true;  // @CHECKME

        // @TODO explain 2 emits
        this.haveInputChange.emit(this.haveInput);
        this.date0Change.emit( e );
        this.widgetCalendarService.dateChanged();
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
