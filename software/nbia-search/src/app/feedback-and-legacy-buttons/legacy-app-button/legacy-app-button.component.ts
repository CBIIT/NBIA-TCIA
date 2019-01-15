import { Component, OnInit } from '@angular/core';
import {Properties} from '@assets/properties';

@Component({
  selector: 'nbia-legacy-app-button',
  templateUrl: './legacy-app-button.component.html',
  styleUrls: [ './legacy-app-button.component.scss']
})
export class LegacyAppButtonComponent implements OnInit {
    /**
     * For HTML access.
     * @type {string}
     */
    legacyAppSite = Properties.LEGACY_APP_SITE;

  constructor() { }

  ngOnInit() {
      this.legacyAppSite =   location.origin.toString() + '/' + Properties.LEGACY_APP_SITE;
  }

}
