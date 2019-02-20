import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Consts } from '@app/consts';
import { UtilService } from '@app/common/services/util.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class CollectionDescriptionsService implements OnDestroy{

    descriptions = null;

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
    }

    getCollectionDescription( criteriaName ) {
        for( let des of this.descriptions ){
            if( des.collectionName.toUpperCase() === criteriaName.toUpperCase() ){
                return des.description
            }
        }
        return '';
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
