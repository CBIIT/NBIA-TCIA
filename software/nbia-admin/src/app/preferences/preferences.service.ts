import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
    showPreferencesEmitter = new EventEmitter();
    setFontSizePreferencesEmitter = new EventEmitter();
    fontSize = '2';
  constructor() { }

  showPreferences(s){
    this.showPreferencesEmitter.emit( s);
  }

  setFontSize(fs){
      this.fontSize = fs;
      console.log('MHL Emit font size: ', fs );
      this.setFontSizePreferencesEmitter.emit( fs );
  }

  getFontSize(){
      return this.fontSize;
  }
}
