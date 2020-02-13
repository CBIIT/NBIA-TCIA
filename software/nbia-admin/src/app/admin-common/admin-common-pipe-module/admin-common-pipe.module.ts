import { NgModule } from '@angular/core';
import { MonthDayYearPipe } from './pipes/month-day-year.pipe';



@NgModule({
    declarations: [MonthDayYearPipe],
    imports: [],
    exports: [
        MonthDayYearPipe
    ],
    providers: [
    ]
})
export class AdminCommonPipeModule { }
