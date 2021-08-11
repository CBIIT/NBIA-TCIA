import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UtilService } from '@app/admin-common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Consts } from '@app/constants';
import { WidgetCalendarService } from '@app/tools/query-section-module/dynamic-query-criteria/widget/widget-calendar/widget-calendar.service';

@Component( {
    selector: 'nbia-widget-calendar-bravo',
    templateUrl: './widget-calendar-bravo.component.html',
    styleUrls: ['./widget-calendar-bravo.component.scss']
} )
export class WidgetCalendarBravoComponent implements OnInit, OnDestroy{

    date3 = new Date();
    @Input() id; // to know first date from second
    @Input() sequenceNumber;
    @Input() prompt0;
    @Input() prompt1;
    @Input() placeHolder0 = '';
    @Input() placeHolder1 = '';

    @Input() date0 = { date: { year: 1961, month: 8, day: 31 } };
    @Output() date0Change: EventEmitter<{}> = new EventEmitter();

    @Input() date1 = { date: { year: 2018, month: 10, day: 9 } };
    @Output() date1Change: EventEmitter<{}> = new EventEmitter();

    @Input() haveInput: boolean;
    @Output() haveInputChange: EventEmitter<{}> = new EventEmitter();

    @Input() ned: any;
    @Output() nedChange: EventEmitter<{}> = new EventEmitter();

    year = 2027; // Set this to today in init
    month = 7; // 0=JAN 11=DEC Set this to today in init
    day = 1;
    daysInMonth = 30;
    daysArray = [];
    monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    startIndex;
    currentDateDisplay0 = '';
    isDateValid = true;

    showCalendar0 = false;
    handleMoving = false;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private utilService: UtilService,private widgetCalendarService: WidgetCalendarService ){
        this.prompt0 = '';
/*
        this.date0Change.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe( ( data ) => {
            console.log('MHL XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX WidgetCalendarBravoComponent: ', data );
        });
*/

        // @TESTING we will set these to NOW.  We will eventually let the parent set this.
        /*
                this.date3.setFullYear(this.year);
                this.date3.setMonth( this.month);
                this.date3.setDate(this.day);
        */
        this.date3 = new Date();
        /*

                console.log( 'MHL applyState: ', this.applyState );
                console.log( 'MHL prompt0: ', this.prompt0 );
                console.log( 'MHL prompt1: ', this.prompt1 );
                console.log( 'MHL placeHolder0: ', this.placeHolder0 );
                console.log( 'MHL placeHolder1: ', this.placeHolder1 );
                console.log( 'MHL date0: ', this.date0 );
                console.log( 'MHL date1: ', this.date1 );
                console.log( 'MHL *** 01 date3: ', this.date3.toDateString() );
                console.log( 'MHL haveInput: ', this.haveInput );
                console.log( 'MHL this.date3.getDay(): ', this.date3.getDay() );
        */
    }

    ngOnInit(){
        this.initThisDay();
        this.setDaysArray();
        this.updateDisplayDate();
        this.onTodayClick();
    }

    initThisDay(){
        let today = new Date();
        this.year = today.getFullYear();
        this.month = today.getMonth();
        this.day = today.getDate();
    }

    setDaysArray(){
        let dateHold = this.date3.getDate();
        this.date3.setDate( 1 ); // Temporarily set date to 1st to get first day (of the week) of the month.
        this.daysInMonth = new Date( this.year, this.month + 1, 0 ).getDate();
        this.startIndex = this.date3.getDay();
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

    updateDisplayDate( monthOffset = 1 ){
        this.currentDateDisplay0 = (this.month + monthOffset) + '/' + this.day + '/' + this.year;
        this.isDateValid = this.utilService.isGoodDate( this.currentDateDisplay0 );
    }

    calendarTextInputChange(){
        this.isDateValid = this.utilService.isGoodDate( this.currentDateDisplay0 );

        // Do we have a good date
        if( this.isDateValid ){
            let parts = this.currentDateDisplay0.split( '/' );

            this.month = +parts[0] - 1;
            // this.date3.setMonth( this.month - 1 );
            this.date3.setMonth( this.month );

            this.day = +parts[1];
            this.date3.setDate( +parts[1] );

            this.year = +parts[2];
            this.date3.setFullYear( this.year );


            this.setDaysArray();
        }

        if( this.id === 0){
            this.widgetCalendarService.date0Changed( this.sequenceNumber, this.date3 );
        }
        if( this.id === 1){
            this.widgetCalendarService.date1Changed( this.sequenceNumber, this.date3 );
        }

    }


    onTodayClick(){

        this.initThisDay();
        this.setDaysArray();
        this.updateDisplayDate();

 /*       this.date3 = new Date();
        this.year = this.date3.getFullYear();
        this.month = this.date3.getMonth();
        this.day = this.date3.getDate();
        console.log('MHL ZED 00 this.year: ', this.year);
        console.log('MHL ZED 01 this.month: ', this.month + 1);
        console.log('MHL ZED 02 this.day: ', this.day);
        this.currentDateDisplay0 = (this.month + 1) + '/' + this.day + '/' + this.year;
*/
        this.currentDateDisplay0 = (this.month + 1) + '/' + this.day + '/' + this.year;
        this.onDayClick( -1,  this.day, this.month, this.year);
        this.isDateValid = this.utilService.isGoodDate( this.currentDateDisplay0 );
    }

    onDayClick( i, d, m, y ){

        let needToUpdatePopup = ( ( m !== this.month) || ( y !== this.year) );

        this.month = m;
        this.year = y;

        this.date3.setMonth( this.month );
        this.date3.setFullYear( this.year );
        this.date3.setDate( d );
        this.day = d;
        this.updateDisplayDate();

        // If we are switching months, don't close the popup.
        if( needToUpdatePopup ){
            this.setDaysArray();

        }else if( i >= 0 ){  // -1 means this was called from the "Today" button so don't close.
            this.setDaysArray();
            this.showCalendar0 = false;
        }
        if( this.id === 0){
            this.widgetCalendarService.date0Changed( this.sequenceNumber, this.date3 );
        }
        if( this.id === 1){
            this.widgetCalendarService.date1Changed( this.sequenceNumber, this.date3 );
        }

    }

    onTestButtonClick(){
        console.log( 'MHL date0: ', this.date0 );
        console.log( 'MHL date3: ', this.date3 );
    }

    // CHECKME
    onDateTextFocus(){
        this.showCalendar0 = !this.showCalendar0;
    }

    onPreviousMonthClick(){
        this.month--;
        if( this.month < 0 ){
            this.month = 11;
        }
        this.date3.setMonth( this.month );
        this.setDaysArray();
        this.updateDisplayDate();
    }

    onNextMonthClick(){
        this.month++;
        if( this.month > 11 ){
            this.month = 0;
        }
        this.date3.setMonth( this.month );
        this.setDaysArray();
        this.updateDisplayDate();
    }

    onPreviousYearClick(){
        this.year--;
        if( this.year < 0 ){
            this.year = 11;
        }
        this.date3.setFullYear( this.year );
        this.setDaysArray();
        this.updateDisplayDate();
    }

    onNextYearClick(){
        this.year++;
        this.date3.setFullYear( this.year );
        this.setDaysArray();
        this.updateDisplayDate();
    }

    isToday( d, m? ){
        if( m === undefined ){
            m = this.month;
        }
/*
        console.log( 'MHL isToday d: ', d );
        console.log( 'MHL isToday this.day: ', this.day );
        console.log( 'MHL m: ', m );
*/

        return d === this.day;
    }

    log(val) { console.log(val); }

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


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
