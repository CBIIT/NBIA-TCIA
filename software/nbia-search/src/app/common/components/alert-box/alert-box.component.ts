import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AlertBoxButtonText,
    AlertBoxButtonType,
    AlertBoxType
} from '@app/common/components/alert-box/alert-box-consts';
import { AlertBoxService } from '@app/common/components/alert-box/alert-box.service';
import { UtilService } from '@app/common/services/util.service';
import { Consts } from '@app/consts';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-alert-box',
    templateUrl: './alert-box.component.html',
    styleUrls: ['../../../app.component.scss', './alert-box.component.scss']
} )
export class AlertBoxComponent implements OnInit, OnDestroy{


    id;
    boxWidth = Consts.ALERT_BOX_WIDTH_DEFAULT;
    showAlertBox = false;
    title = '';
    type;
    text = [];
    buttons = 0;
    buttonArray = [];

    // For HTML access
    AlertBoxT = AlertBoxType;
    AlertBoxButtonT = AlertBoxButtonType;
    AlertBoxButtonTex = AlertBoxButtonText;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private alertBoxService: AlertBoxService, private utilService: UtilService ) {
    }

    ngOnInit() {
        this.alertBoxService.alertBoxEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.id = data['id'];
                this.type = data['type'];
                this.title = data['title'];
                this.text = data['text'];
                this.buttons = data['buttons'];
                this.initButtons();
                if( this.utilService.isNullOrUndefined( data['width'] ) ){
                    this.boxWidth = Consts.ALERT_BOX_WIDTH_DEFAULT;
                }
                else{
                    this.boxWidth = data['width'];
                }
                this.showAlertBox = true;
            }
        );
    }

    /**
     * Convert an ORed int of buttons to an array
     */
    initButtons() {
        this.buttonArray = [];
        if( (this.buttons & 1) === 1 ){
            this.buttonArray.push( 1 );
        }
        if( (this.buttons & 2) === 2 ){
            this.buttonArray.push( 2 );
        }
        if( (this.buttons & 4) === 4 ){
            this.buttonArray.push( 4 );
        }
        if( (this.buttons & 8) === 8 ){
            this.buttonArray.push( 8 );
        }
        if( (this.buttons & 16) === 16 ){
            this.buttonArray.push( 16 );
        }
    }

    /**
     * Return the button which was clicked, and notify anything that is disabled while the Alert box is up
     *
     * @param button
     */
    onButtonClick( button ) {
        this.alertBoxService.alertBoxReturnEmitter.emit( { 'id': this.id, button } );
        this.showAlertBox = false;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
