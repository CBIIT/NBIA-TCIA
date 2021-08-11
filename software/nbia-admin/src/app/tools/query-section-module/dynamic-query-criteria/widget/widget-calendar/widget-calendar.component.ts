import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { WidgetCalendarService } from '@app/tools/query-section-module/dynamic-query-criteria/widget/widget-calendar/widget-calendar.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component( {
    selector: 'nbia-widget-calendar',
    templateUrl: './widget-calendar.component.html',
    styleUrls: ['./widget-calendar.component.scss']
} )
export class WidgetCalendarComponent implements OnInit, OnDestroy{
    ned = { 'text': 'ned_000' };

    // From WidgetComponent
    @Input() sequenceNumber;
    @Input() prompt0;
    @Input() prompt1;
    @Input() placeHolder0 = '';
    @Input() placeHolder1 = '';

    @Input() date0 = { date: { year: 1961, month: 8, day: 31 } };
    @Output() date0Change: EventEmitter<{}> = new EventEmitter(); // Back to WidgetComponent
    @Input() date1 = { date: { year: 2018, month: 10, day: 9 } };
    @Output() date1Change: EventEmitter<{}> = new EventEmitter(); // Back to WidgetComponent

    @Input() haveInput: boolean;
    @Output() haveInputChange: EventEmitter<{}> = new EventEmitter();
    id0 = 0;
    id1 = 1;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private widgetCalendarService: WidgetCalendarService, private utilService: UtilService ){

    }

    ngOnInit(){
        this.widgetCalendarService.date0Change.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                let temp = <Date>data.date0Data;
                this.date0['formatted']  =  (temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear();
            } );
        this.widgetCalendarService.date1Change.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
               this.date1['formatted']  =  (data['date1Data']['month'] + 1) + '/' + data['date1Data']['day'] + '/' + data['date1Data']['year'];
            }
        );
    }


    ngOnDestroy(): void{
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
