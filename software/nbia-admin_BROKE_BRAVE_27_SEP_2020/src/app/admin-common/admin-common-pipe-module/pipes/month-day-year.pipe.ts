import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
    name: 'monthDayYear'
} )
export class MonthDayYearPipe implements PipeTransform{

    transform( value: any, ...args: any[] ): any {
        let d = value;

        let date = '';
        if( d.month < 10 ){
            date += '0';
        }
        date += d.month + '/';

        if( d.day < 10 ){
            date += '0';
        }
        date += d.day + '/' + d.year;


        return date;
    }


}
