import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilService } from '@app/admin-common/services/util.service';
import { ReleaseDateCalendarService } from '@app/tools/perform-qc-module/perform-qc/release-date-calendar/release-date-calendar.service';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-release-date-calendar',
    templateUrl: './release-date-calendar.component.html',
    styleUrls: ['./release-date-calendar.component.scss']
} )
export class ReleaseDateCalendarComponent implements OnInit{
    year = 2027; // Set this to today in init
    month = 7; // 0=JAN 11=DEC Set this to today in init
    day = 1;
    daysInMonth = 30;
    daysArray = [];
    monthName = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    date0 = { date: { year: 1961, month: 8, day: 31 } };
    prompt0 = 'Prompt';
    currentDateDisplay0 = '';
    startIndex;
    isDateValid = true;

    showCalendar0 = true;
    handleMoving = false;
    date3 = new Date();

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private utilService: UtilService, private releaseDateCalendarService: ReleaseDateCalendarService ){
    }

    ngOnInit(){
        this.releaseDateCalendarService.releaseDateEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.date3 = data;
            } );


        this.initThisDay();
        this.setDaysArray();
        this.updateDisplayDate();
    }

    initThisDay(){
        let today = new Date();
        this.year = today.getFullYear();
        this.month = today.getMonth() + 1;
        this.day = today.getDate();
    }


    setDaysArray(){
        if( this.date3 == null ){ // For when before it's been set
            this.date3 = new Date();
        }else{
            this.date3 = new Date( this.year, this.month, this.day );
        }
        let dateHold = this.date3.getDate();
        this.date3.setDate( 1 ); // Temporarily set date to 1st to get first day (of the week) of the month.
        this.daysInMonth = new Date( this.year, this.month, 0 ).getDate();
        this.startIndex = new Date( this.year, this.month - 1, 1 ).getDay();
        this.date3.setDate( dateHold ); // Restore
        this.daysArray = [];


        // Previous months last days
        // Get number of days for previous month
        let lastMonth = this.month - 1;
        let lastMonthYear = this.year;
        let nextMonthYear = this.year + 1;

        if( lastMonth < 0 ){
            lastMonth = 11;
            lastMonthYear--;
        }
        let lastMonthLastDay = new Date( lastMonthYear, lastMonth + 1, 0 ).getDate();
        for( let f = this.startIndex - 1; f >= 0; f-- ){
            this.daysArray[f] = { 'day': lastMonthLastDay, 'month': lastMonth, 'year': lastMonthYear };
            lastMonthLastDay--;
        }
        // END Previous months last days

        // Current month
        let d = 1;
        let f;
        for( f = this.startIndex; f < ((this.daysInMonth + this.startIndex)); f++ ){
            this.daysArray[f] = { 'day': d, 'month': this.month, 'year': this.year };
            d++;
        }
        // END Current month

        // The first days of the next month
        d = 1;
        for( f = (this.daysInMonth + this.startIndex); f < (7 * 6); f++ ){
            let nextMonth = this.month + 1;
            if( nextMonth > 11 ){
                nextMonth = 0
            }
            this.daysArray[f] = { 'day': d, 'month': nextMonth, 'year': nextMonthYear };
            d++;
        }
        // END The first days of the next month
    }


    updateDisplayDate( monthOffset = 0 ){
        this.currentDateDisplay0 = (this.month + monthOffset) + '/' + this.day + '/' + this.year;
        this.isDateValid = this.utilService.isGoodDate( this.currentDateDisplay0 );
    }


    onDateTextFocus(){
       // console.log( 'MHL onDateTextFocus' );
    }

    onDayClick( i, d, m, y ){
        // releaseDateCalendarService
        this.date0 = { date: { year: y, month: m, day: d } };
        this.releaseDateCalendarService.setReleaseDate( this.date0 );
        this.showCalendar( false ); // Hide the calendar
    }

    onPreviousMonthClick(){
        this.month--;
        if( this.month < 0 ){
            this.month = 11;
            this.year--;
            this.day = 1;
        }
        this.setDaysArray();
        this.updateDisplayDate();
    }

    onNextMonthClick(){
        this.month++;
        if( this.month > 11 ){
            this.month = 0;
            this.year++;
            this.day = 1;
        }
        this.setDaysArray();
        this.updateDisplayDate();
    }

    onTodayClick(){
        this.initThisDay();
        this.setDaysArray();
        this.updateDisplayDate();
        this.onDayClick(0, this.day, this.month, this.year);
    }

    onPreviousYearClick(){
        this.year--;
        this.setDaysArray();
        this.updateDisplayDate();
    }

    onNextYearClick(){
        this.year++;
        this.setDaysArray();
        this.updateDisplayDate();
    }

    /////////////////////////
    onDragBegin( e ){
        this.handleMoving = true;
        // console.log('MHL [' + this.handleMoving + '] onDragBegin: ', e);
    }

    onDragEnd( e ){
        //  console.log('MHL [' + this.handleMoving + '] onDragEnd: ', e);
    }

    onMoving( e ){
        //  console.log('MHL [' + this.handleMoving + '] onMoving: ', e);
        this.handleMoving = true;
    }

    onMoveEnd( e ){
        //  console.log('MHL [' + this.handleMoving + '] onMoveEnd: ', e);
        this.handleMoving = false;
    }

    showCalendar( s ){
        this.releaseDateCalendarService.showPopupCalendar( s );
    }

    ngOnDestroy(){
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
