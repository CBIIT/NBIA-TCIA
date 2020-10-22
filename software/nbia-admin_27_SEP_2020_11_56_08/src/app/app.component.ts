import { Component } from '@angular/core';
import { IKeyboardShortcutListenerOptions, KeyboardKeys } from 'ngx-keyboard-shortcuts';

@Component({
  selector: 'nbia-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nbia-admin';
/*
    keyboardShortcutDef: IKeyboardShortcutListenerOptions = {
        description: 'save',
        keyBinding: [KeyboardKeys.Alt, 'q']
    };

    save(){
        console.log('MHL TOP save');
    }
    */
}
