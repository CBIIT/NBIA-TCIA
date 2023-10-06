import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Consts } from '@app/consts';
import { UtilService } from '@app/common/services/util.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CollectionDescriptionsService implements OnDestroy{

    descriptions = null;
    licData;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private apiServerService: ApiServerService,
                 private utilService: UtilService ) {
        this.initDescriptionList();

        this.commonService.updateCollectionDescriptionsEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.initDescriptionList();
            }
        )
    }


    async initDescriptionList() {

        // ------------------------------------------------------------------------------------------
        // Get the description list.
        // ------------------------------------------------------------------------------------------
        this.apiServerService.collectionDescriptionsResultsEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            ( data ) => {
                this.descriptions = data;
            } );

        // The call to trigger populating this.descriptions (above), and wait for the results.
        this.apiServerService.dataGet( Consts.COLLECTION_DESCRIPTIONS, '' );
        while( this.utilService.isNullOrUndefined( this.descriptions ) ){
            await this.commonService.sleep( Consts.waitTime );
        }

        // Get the list of licenses and their associated data.
        this.apiServerService.collectionLicensesResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.licData = data;
            } );
        this.apiServerService.getCollectionLicenses();

    }

    getCollectionDescription( criteriaName ) {
        for( let des of this.descriptions ){
            if( des['collectionName'].toUpperCase() === criteriaName.toUpperCase() ){
                return des.description;
            }
        }
        return '';
    }

    getCollectionLicense( criteriaName ) {
        for( let des of this.descriptions ){
            if( des['collectionName'].toUpperCase() === criteriaName.toUpperCase() ){
                for( let lic of this.licData ){
                    if( lic['id'] === des['licenseId']){
                        return lic;
                    }
                }
            }
        }
        return {};
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
