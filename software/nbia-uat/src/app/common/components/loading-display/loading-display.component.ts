import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingDisplayService } from './loading-display.service';
//import { CommonService } from '@app/image-search/services/common.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-loading-display',
    templateUrl: './loading-display.component.html',
    styleUrls: ['../../../app.component.scss', './loading-display.component.scss']
} )
export class LoadingDisplayComponent implements OnInit, OnDestroy{
    showBusy = true;
    message = 'Initializing';
    subMessage = '';

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

 //   constructor( private loadingDisplayService: LoadingDisplayService, private commonService: CommonService ) {
	constructor( private loadingDisplayService: LoadingDisplayService) {
    }

    ngOnInit() {

        // It is possible for loadingDisplayService.isLoadingEmitter, to have emitted a value=false before we subscribed.
        if( this.loadingDisplayService.getIsLoading() === 0){
            this.message = '';
            this.subMessage = '';
            this.showBusy = false;
        }


        this.loadingDisplayService.isLoadingEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            async data => {
                // This small wait will keep showBusy from getting out of sync between parent and child which caused the following error:
                // "Error: Expression has changed after it was checked. Previous value: 'hide-item: true'. Current value: 'hide-item: false'."
                //await this.commonService.sleep( 10 );
//				await new Promise( resolve => setTimeout( resolve, 10 ) );

                this.message = data['message'];
                this.subMessage = data['subMessage'];
                this.showBusy = data['value'];
            }
        );


        this.loadingDisplayService.isLoadingSubMessageEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            async data => {	
                // This small wait will keep showBusy from getting out of sync between parent and child which caused the following error:
                // "Error: Expression has changed after it was checked. Previous value: 'hide-item: true'. Current value: 'hide-item: false'."
			//	await this.commonService.sleep( 10 );
//				await new Promise( resolve => setTimeout( resolve, 10 ) );
                this.subMessage = <string>data;
            }
        );
		
//		this.loadingDisplayService.status.subscribe((val: boolean) => {
//            this.showBusy = val;
//			console.log("this.showBasy="+ this.showBusy);
//        });
    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
