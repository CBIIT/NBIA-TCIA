import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WidgetCalendarService {
    dateChange = new EventEmitter();

  constructor() { }

    dateChanged(){
      this.dateChange.emit();
    }
}
