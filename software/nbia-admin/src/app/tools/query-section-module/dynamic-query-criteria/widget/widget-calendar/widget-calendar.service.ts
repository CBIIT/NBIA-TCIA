import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WidgetCalendarService {
    date0Change = new EventEmitter();
    date1Change = new EventEmitter();

  constructor() { }

    date0Changed( seq, d ){
      this.date0Change.emit({'sequenceNumber': seq, 'date0Data': d});
    }

    date1Changed( seq, d ){
      this.date1Change.emit({'sequenceNumber': seq, 'date1Data': d});
    }
}
