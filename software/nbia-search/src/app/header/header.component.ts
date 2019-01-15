import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuService } from '@app/common/services/menu.service';
import { CartService } from '@app/common/services/cart.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Properties } from '@assets/properties';
import { UtilService } from '@app/common/services/util.service';
import { CommonService } from '../image-search/services/common.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { AlertBoxButtonType, AlertBoxType } from '@app/common/components/alert-box/alert-box-consts';
import { AlertBoxService } from '@app/common/components/alert-box/alert-box.service';
import { Consts, MenuItems } from '@app/consts';
import { HistoryLogService } from '@app/common/services/history-log.service';

import { Subject } from 'rxjs';


@Component( {
    selector: 'nbia-header',
    templateUrl: './header.component.html',
    styleUrls: ['../app.component.scss', './header.component.scss']
} )

export class HeaderComponent implements OnInit{

    properties = Properties;
    constructor(  ) {
    }

    ngOnInit() {

    }

}
