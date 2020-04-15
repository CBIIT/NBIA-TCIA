import { Component, Input, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { QuerySectionService } from '../services/query-section.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisplayQueryService } from '../../display-query-module/display-query/display-query.service';

@Component( {
    selector: 'nbia-query-patient-id',
    templateUrl: './query-patient-id.component.html',
    styleUrls: ['./query-patient-id.component.scss', '../left-section/left-section.component.scss']
} )

export class QueryPatientIdComponent implements OnInit{
    @Input() currentTool;

    /**
     * For hide or show this group of criteria when the arrows next to the heading are clicked.
     */
    showSubjectIds = false;

    /**
     * The comma separated list of Subject IDs to search for.  This is bound to the UI input.
     * @type {string}
     */
    subjectText = '';
    subjectIds;
    consts = Consts;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private querySectionService: QuerySectionService, private utilService: UtilService,
                 private displayQueryService: DisplayQueryService) {
    }

    ngOnInit() {
        this.displayQueryService.clearQuerySectionQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.onClearClick();
            } );
    }

    /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param {boolean} show
     */
    onShowSubjectIdsClick( show: boolean ) {
        this.showSubjectIds = show;
        //   this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_SUBJECT_ID, this.showSubjectIds );
    }

    /**
     * Clears the UI input, and sends an empty query via onSearchClick() to clear the Search results and Display query.
     */
    onClearClick() {
        this.subjectText = '';
        this.subjectIds = null;
        this.updateQuery();
    }

    /**
     * Get the list of IDs, split them on commas, and ad to the query.
     */
    onSearchClick() {
        // Comma delimited
        if( this.utilService.isNullOrUndefinedOrEmpty(this.subjectText)){
            this.subjectIds = [];
        }
        else{
            this.subjectIds = this.subjectText.replace( /^,?\s*,?/g, '' ).replace( /\s*,\s*/g, ',' ).replace( /\s*$/, '' ).split( ',' );
        }
        this.updateQuery();

        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
    }

    updateQuery() {
        this.querySectionService.updateSearchQuery( this.currentTool, Consts.QUERY_CRITERIA_SUBJECT_ID, this.subjectIds );
    }

}
