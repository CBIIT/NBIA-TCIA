import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Properties } from '@assets/properties';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilService } from '@app/common/services/util.service';

@Component( {
    selector: 'nbia-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class FooterComponent implements OnInit{

    properties = Properties;

    constructor(  ) {
    }

    ngOnInit() {
     }

}
