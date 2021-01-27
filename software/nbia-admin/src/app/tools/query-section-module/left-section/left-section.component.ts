import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuerySectionService } from '../services/query-section.service';
import { Properties } from '@assets/properties';


@Component( {
    selector: 'nbia-left-section',
    templateUrl: './left-section.component.html',
    styleUrls: ['./left-section.component.scss']
} )

/**
 *  This is the parent component for the Left section, it contains query-section.
 *  It has the show and hide buttons at the top which "close" and "open" the whole left query-section.
 */
export class LeftSectionComponent implements OnInit, OnDestroy{
    @Input() useQcStatusLeftSectionComponent;
    @Input() currentTool;

    consts = Consts;

    searchType = Consts.CRITERIA_SEARCH; // CHECKME  We don't need this, or the emitter (at least for now)

    properties = Properties;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private querySectionService: QuerySectionService ) {
    }

    ngOnInit() {
        this.querySectionService.updateSearchTypeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.searchType = data;
            } );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
