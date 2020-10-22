import { NgModule } from '@angular/core';
import { MonthDayYearPipe } from './pipes/month-day-year.pipe';
import { ShortenRightPipe } from './pipes/shorten-right.pipe';
import { ShortenPipe } from './pipes/shorten.pipe';



@NgModule({
    declarations: [
        MonthDayYearPipe,
        ShortenPipe,
        ShortenRightPipe
    ],
    imports: [],
    exports: [
        MonthDayYearPipe,
        ShortenPipe,
        ShortenRightPipe
    ],
    providers: [
    ]
})
export class AdminCommonPipeModule { }
