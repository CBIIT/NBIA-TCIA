import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
    showPreferencesEmitter = new EventEmitter();
    setFontSizePreferencesEmitter = new EventEmitter();
    fontSize;
  constructor() { }

  showPreferences(s){
    this.showPreferencesEmitter.emit( s);
  }

  setFontSize(fs){
      console.log('MHL PreferencesService setFontSize: ', fs );
      this.fontSize = fs;
      this.setFontSizePreferencesEmitter.emit( fs );
  }

  getFontSize(){
      return this.fontSize;
  }
}
