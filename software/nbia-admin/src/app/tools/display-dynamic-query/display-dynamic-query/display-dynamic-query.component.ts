import { Component, Input, OnInit } from '@angular/core';
import { DisplayDynamicQueryService } from '@app/tools/display-dynamic-query/display-dynamic-query/display-dynamic-query.service';

@Component( {
    selector: 'nbia-display-dynamic-query',
    templateUrl: './display-dynamic-query.component.html',
    styleUrls: ['./display-dynamic-query.component.scss']
} )
export class DisplayDynamicQueryComponent implements OnInit{
    @Input() currentTool;

    constructor( private displayDynamicQueryService: DisplayDynamicQueryService ) {
    }

    ngOnInit() {
    }

    /**
     * The "Clear" button on the left side of the Display query.
     */
    onClearQueryClick() {
        console.log( 'MHL DisplayDynamicQueryComponent onClearQueryClick' );
        this.displayDynamicQueryService.clearQuerySectionQuery();
    }


}
