import { Component, OnInit } from '@angular/core';
import {Properties} from '@assets/properties';


@Component({
  selector: 'nbia-feedback-button',
  templateUrl: './feedback-button.component.html',
  styleUrls: ['./feedback-button.component.scss']
})
export class FeedbackButtonComponent implements OnInit {

    /**
     * For HTML access.
     * @type {string}
     */
    feedBackSite = Properties.FEEDBACK_SITE;

  constructor() { }

  ngOnInit() {
  }

}
