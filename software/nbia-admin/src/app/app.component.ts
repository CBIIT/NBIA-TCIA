import { Component } from '@angular/core';
import {Properties} from "@assets/properties";


@Component({
  selector: 'nbia-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'nbia-admin';
  properties = Properties;
}
