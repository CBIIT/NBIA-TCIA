import { Component, OnInit } from '@angular/core';
import { Properties } from '../../../../assets/properties';
import { Consts } from '../../../constants';
import { ApiService } from '../../../admin-common/services/api.service';
import { UtilService } from '../../../admin-common/services/util.service';


@Component( {
    selector: 'nbia-qc-tool',
    templateUrl: './qc-tool.component.html',
    styleUrls: ['./qc-tool.component.scss']
} )

/**
 * The parent component for "Perform QC"
 */
export class QcToolComponent implements OnInit{
    consts = Consts;
    userRoles;
    roleIsGood = false;

    constructor(private apiService: ApiService, private utilService: UtilService) {
    }

   async ngOnInit() {
       // make sure we are not ahead of apiService initialization.
       while( this.userRoles === undefined){
           console.log('MHL 102 getUserRoles: ', this.userRoles);

           this.userRoles = this.apiService.getUserRoles();
           if( this.userRoles !== undefined && this.userRoles.indexOf( 'NCIA.MANAGE_VISIBILITY_STATUS' ) > -1 ){
               this.roleIsGood = true;
           }
           await this.utilService.sleep( Consts.waitTime );
       }
       // @TODO Do stuff...
        console.log('MHL this.userRoles: ', this.userRoles);
    }

}
