import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'addNewLine'})
export class AddNewLinePipe implements PipeTransform {
  transform(value: string): string {
    let newStr: string = value.replace(/, /g, '\n');
    return newStr;
  }
}