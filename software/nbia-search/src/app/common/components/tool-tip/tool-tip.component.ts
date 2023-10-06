import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Properties} from '@assets/properties';

@Component({
    selector: 'nbia-tool-tip',
    templateUrl: './tool-tip.component.html',
    styleUrls: ['./tool-tip.component.scss']

    ,
    animations: [
        trigger('showToolTip', [
            state('true', style({opacity: 1})),
            state('false', style({opacity: 0})),
            transition('0 => 1', animate('0')),
            transition('1 => 0', animate('0'))
        ])
    ]

})
export class ToolTipComponent implements OnInit {

    @Input() toolTipY;
    @Input() toolTipText;
    @Input() toolTipHeading;

    @Input() showToolTip: boolean = false;
    @Output() showToolTipChange = new EventEmitter<boolean>();

    properties = Properties;

    constructor() {
    }

    ngOnInit() {
    }


    hideShowAnimation() {
        this.showToolTip = !this.showToolTip;
    }

    onToolTopCloseClick() {
        this.showToolTip = false;
        if (Properties.COLLECTION_DESCRIPTION_TOOLTIP_TYPE === 1) {
            this.showToolTipChange.emit(this.showToolTip);
        }
    }
}
