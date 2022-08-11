import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSite'
})
export class RemoveSitePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
      let shortenedString = '';
      shortenedString = value.replace(/\/\/.*/, '');
    return shortenedString;
  }

}
