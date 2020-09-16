import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '@app/common/services/cart.service';
import { CommonService } from '@app/image-search/services/common.service';
import { AlertBoxService } from '@app/common/components/alert-box/alert-box.service';
import { AlertBoxButtonType, AlertBoxType } from '@app/common/components/alert-box/alert-box-consts';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


/**
 * The Delete all Cart contents button on the left side of the header of the "Cart" page.
 */
@Component( {
    selector: 'nbia-cart-delete',
    templateUrl: './cart-delete.component.html',
    styleUrls: ['./cart-delete.component.scss']
} )
export class CartDeleteComponent implements OnInit, OnDestroy{

    // To determine if alertBoxService.alertBoxReturnEmitter is ours.
    alertId = 'nbia-cart-delete-00';

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private cartService: CartService, private commonService: CommonService,
                 private alertBoxService: AlertBoxService ) {
    }

    ngOnInit() {

        // The answer back from the "Are you sure" alertBox.
        this.alertBoxService.alertBoxReturnEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                if( data['id'] === this.alertId ){
                    if( data['button'] === AlertBoxButtonType.DELETE ){
                        this.cartService.clearCart();
                        this.commonService.updateCartCount( 0 );
                    }
                }
            }
        );
    }

    onDeleteCartClick() {
        this.alertBoxService.alertBoxDisplay( this.alertId, AlertBoxType.ERROR, 'Delete Cart',
            ['Delete all Cart contents?'], AlertBoxButtonType.CANCEL | AlertBoxButtonType.DELETE, 300 );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
