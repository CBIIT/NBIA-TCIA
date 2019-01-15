import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PieChartService } from '@app/image-search/data-section/data-section-tabs/summary/pie-charts/pie-chart.service';


@Component( {
    selector: 'nbia-description-popup',
    templateUrl: './description-popup.component.html',
    styleUrls: ['./description-popup.component.scss'],
    animations: [
        trigger( 'showModalityDescription', [
            state( 'true', style( { opacity: 1 } ) ),
            state( 'false', style( { opacity: 0 } ) ),
            transition( '0 => 1', animate( '0' ) ),
            transition( '1 => 0', animate( '0' ) )
        ] )
    ]
} )


export class DescriptionPopupComponent implements OnInit{

    /**
     * Show the Popup if true.
     */
    @Input() showModalityDescription;

    /**
     * Popup width, with Default if not passed in by parent.
     *
     * @type {number}
     */
    @Input() width = 200;

    /**
     * Used to determine which charts Popup close "X" has been clicked.
     */
    @Input() chartType;

    /**
     * Pixels from the top of the whole chart box including the heading.
     * With a default if not passed in by parent.
     *
     * @type {number}
     */
    @Input() descriptionPopupY = 72;

    /**
     * The text of the description.
     *
     * @type {string}
     */
    @Input() descriptionPopupText = '';

    /**
     * The text of the heading.
     *
     * @type {string}
     */
    @Input() descriptionPopupHeading = 'Heading';

    /**
     * Include vertical scroll bar
     * With a default if not passed in by parent.
     *
     * @type {boolean}
     */
    @Input() descriptionScroll = true;

    constructor( private pieChartService: PieChartService ) {
    }

    ngOnInit() {
    }

    onHideShowAnimationClick() {
        this.showModalityDescription = false;

        // CHECKME This should not have been needed.  The two way binding of showModalityDescription is not working from child to parent.
        this.pieChartService.setShowDescription( this.chartType, false );
    }

}
