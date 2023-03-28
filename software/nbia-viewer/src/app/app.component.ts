import { Component } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'nbia-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'viewer';

  constructor(private modalService: NgbModal) {
  }

  public open(modal: any): void {

    this.modalService.open(modal);
  }

}
