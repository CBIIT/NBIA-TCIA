import { Component, OnInit } from '@angular/core';
import { Properties } from '@assets/properties';


@Component({
  selector: 'nbia-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.scss']
})

export class CustomMenuComponent implements OnInit {
    properties = Properties;
    homeUrl = this.properties.API_SERVER_URL + '/nbia-search';

  constructor() { }

  ngOnInit() {
  }

}
