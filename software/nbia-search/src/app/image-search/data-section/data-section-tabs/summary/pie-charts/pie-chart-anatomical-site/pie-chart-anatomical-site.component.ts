import { Component, OnInit, ElementRef, Input, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { CommonService } from '@app/image-search/services/common.service';
import { Consts } from '@app/consts';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { UtilService } from '@app/common/services/util.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-pie-chart-anatomical-site',
    templateUrl: './pie-chart-anatomical-site.component.html',
    styleUrls: ['../../summary.component.scss']
} )
export class PieChartAnatomicalSiteComponent implements OnInit, OnDestroy{
    parentNativeElement: any;

    chartName = 'Anatomical Sites';
    chartFooter = 'Anatomical Site';
    chartFooterPlural = 'Anatomical Sites';
    showAnatomicalSiteChart = true;

    /**
     * The width of the actual pie.
     * @type {number}
     */
    width = Consts.CHART_WIDTH;

    /**
     * The height of the actual pie.
     * @type {number}
     */
    height = Consts.CHART_HEIGHT;

    /**
     * The width of the svg in the DOM, the rectangle around the pie chart.
     * @type {number}
     */
    dispWidth: any = this.width + Consts.CHART_WIDTH_MARGIN;

    /**
     * The height of the svg in the DOM, the rectangle around the pie chart.
     * @type {number}
     */
    dispHeight: any = this.height + Consts.CHART_HEIGHT_MARGIN;

    /**
     * The text displayed at the bottom of each chart.<br>
     * When the mouse is off the chart - Number of Anatomical Sites in the chart.<br>
     * When mouse is on the chart - Then name of the Anatomical Site under the mouse, and the number of them in the Search results, or total if there are no search results.
     */
    footerText;

    /**
     * The base radius of the chart.<br>
     * For the non-moused over slices the radius will be this.radius - 2.<br>
     * For the moused over slice the radius will be this.radius + 3.<br>
     */
    radius;

    /**
     * List of colors created from Consts.COLOR_ARRAY, used to assign colors to the chart slices.
     */
    color;

    /**
     * The parent Pie object, it is created from the values for each "arc" with d3.pie().
     */
    pie;

    /**
     * The the default size arcs (not moused-over), created with d3.arc() using radius-2 for the size.
     */
    arc;

    /**
     * The large arcs, for when the mouse is over an individual slice, created with d3.arc() using radius+3 for the size.
     */
    arcLarge;

    /**
     * This is connected to and creates our svg element in the DOM with the ID "pie-anatomical-site"  this.svg = d3.select( '#pie-anatomical-site' ).
     */
    svg;

    /**
     * The complete list of criteria for this category, it's initialized in ngOnInit() and used when we need to restore the full original list.
     */
    completeCriteriaList;

    /**
     * The list used to create the chart.
     */
    criteriaList;

    g;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private element: ElementRef, private commonService: CommonService,
                 private apiServerService: ApiServerService, private utilService: UtilService ) {
        this.parentNativeElement = element.nativeElement;
    }

    async ngOnInit() {

        // Get the full complete criteria list.
        this.apiServerService.getBodyPartValuesAndCountsEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.completeCriteriaList = this.utilService.copyCriteriaObjectArray( data );

                // Initialize criteriaList with completeCriteriaList here at the start, before there is any searching
                this.criteriaList = this.completeCriteriaList;

                this.updateChart();
            } );


        this.apiServerService.criteriaCountUpdateEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            async data => {
                if( (this.utilService.isNullOrUndefined( data )) || (this.utilService.isNullOrUndefined( data['res'] )) || (data['res'].length < 1) ){
                    return;
                }

                let criteriaCounts = 0;
                if( (!this.utilService.isNullOrUndefined( data )) && (!this.utilService.isNullOrUndefined( data['res'] )) && (data['res'].length > 0) ){
                    for( let crtCount of data['res'] ){
                        if( crtCount.criteria === 'Anatomical Site' ){
                            criteriaCounts = crtCount.values;
                        }
                    }
                    this.showAnatomicalSiteChart = true;
                    this.criteriaList = criteriaCounts;
                    this.updateChart();
                }
            }
        );

        this.commonService.updateChartEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            () => {
                this.updateChart();
            }
        );

        this.commonService.reInitChartEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            () => {
                this.reInit();
            }
        );


        this.commonService.searchResultsCountEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {

                if( data === -1 ){

                    // Initialize criteriaList with completeCriteriaList here at the start, before there is any searching
                    this.criteriaList = this.completeCriteriaList;
                    this.updateChart();
                }
            }
        );
    }


    // CHECKME Testing - need to refresh after a new login
    async reInit() {
        // The call to trigger populating this.completeCriteriaList (above), and wait for the results.
        this.completeCriteriaList = null;
        this.apiServerService.dataGet( 'getBodyPartValuesAndCounts', '' );
        while( this.utilService.isNullOrUndefined( this.completeCriteriaList ) ){
            await this.commonService.sleep( Consts.waitTime );
        }

        // Initialize criteriaList with completeCriteriaList here at the start, before there is any searching
        this.criteriaList = this.utilService.copyCriteriaObjectArray( this.completeCriteriaList );
        this.updateChart();
    }


    updateChart() {
        try{
            this.g.select( 'path' ).remove();
        }catch( e ){
            // console.log( 'THIS IS PROBABLY NO PROBLEM: ', e.message );
        }
        this.buildChart();
    }


    buildChart() {
        if( this.utilService.isNullOrUndefined( this.criteriaList ) ){
            return;
        }

        if( this.criteriaList.length < 1 ){
            this.footerText = '0 ' + this.chartFooterPlural;
            this.showAnatomicalSiteChart = false;
            return;
        }
        else{
            this.showAnatomicalSiteChart = true;
            this.footerText = this.criteriaList.length + ' ' + ((+this.criteriaList.length > 1) ? this.chartFooterPlural : this.chartFooter);
        }

        this.radius = Math.min( this.width, this.height ) / 2;
        let color = d3.scaleOrdinal()
            .range( <any>Consts.COLOR_ARRAY );


        // d is an individual element of data
        this.pie = d3.pie()
            .value(
                function( d ) {
                    return d['count'];
                }
            )( <any>this.criteriaList );

        // Make the default size arc (not moused-over)
        this.arc = d3.arc()
            .outerRadius( this.radius - 2 )
            .innerRadius( 0 );

        // Make the large arc, for when the mouse is over an individual slice.
        this.arcLarge = d3.arc()
            .outerRadius( this.radius + 3 )
            .innerRadius( 0 );

        // Add an svg to the DOM at svg tag with the ID 'pie-anatomical-site'
        this.svg = d3.select( '#pie-anatomical-site' )
            .append( 'svg' )
            .attr( 'width', this.dispWidth )
            .attr( 'height', this.dispHeight )
            .append( 'g' )
            .attr( 'transform', <string>('translate(' + +this.dispWidth / 2 + ',' + +this.dispHeight / 2 + ')') ); // Moving the center point. 1/2 the width and 1/2 the height

        this.g = this.svg.selectAll( 'arc' )
            .data( this.pie )
            .enter().append( 'g' )
            .on( 'mouseover', ( data ) => {
                this.footerText = ((data['data']['criteria'].length > 0) ? data['data']['criteria'] : 'None') + ' - ' + data['data']['count'];
                d3.selectAll( <string>('#path-anatomical-site' + data['index']) )
                    .transition()
                    .duration( 200 )
                    .attr( 'd', this.arcLarge )
                // .style('cursor', 'pointer')   // Put this back when mouse clicking does something.
                ;
            } )

            .on( 'mouseout', ( data ) => {
                this.footerText = this.criteriaList.length + ' ' + ((+this.criteriaList.length > 1) ? this.chartFooterPlural : this.chartFooter);
                d3.selectAll( <string>('#path-anatomical-site' + data['index']) )
                    .transition()
                    .delay( 100 )
                    .duration( 250 )
                    .attr( 'd', this.arc );
            } );


        this.g.append( 'path' )
            .attr( 'd', <any>this.arc )

            // Give each arc a unique ID, so I can identify him in the mouseover and mouseout  functions.
            .attr( 'id', ( data ) => {
                let index = data['index'];
                return 'path-anatomical-site' + index.toString();
            } )

            // Give each arc a unique color, they will repeat when I run out of colors.
            .style( 'fill', <any>function( d ) {
                return color( d['data']['criteria'] );
            } );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
