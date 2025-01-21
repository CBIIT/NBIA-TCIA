import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Consts } from '@app/consts';
import { UtilService } from '@app/common/services/util.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nbia-images-desciption-search',
  templateUrl: './images-desciption-search.component.html',
  styleUrls: ['../images-search-tab.component.scss', './images-desciption-search.component.scss']
})

export class ImagesDesciptionSearchComponent implements OnInit, OnDestroy{

    /**
     * For hide or show this group of criteria when the arrows next to the heading are clicked.
     */
    showSubjectIds;

    /**
     * The comma separated list of Subject IDs to search for.  This is bound to the UI input.
     * @type {string}
     */
    searchText = '';
    subjectText = '';

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private parameterService: ParameterService,
                 private queryUrlService: QueryUrlService, private apiServerService: ApiServerService,
                 private utilService: UtilService ) {

        this.parameterService.parameterSubjectIdEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.searchText = <string>data;
                this.onSearchClick();
                this.commonService.setHaveUserInput( false );

            }
        );
    }

    ngOnInit() {

        // Get persisted showCriteriaList value.  Used to show, or collapse this category of criteria in the UI.
        this.showSubjectIds = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_SUBJECT_ID );
        if( this.utilService.isNullOrUndefined( this.showSubjectIds ) ){
            this.showSubjectIds = Consts.SHOW_CRITERIA_QUERY_SUBJECT_ID_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_SUBJECT_ID, this.showSubjectIds );
        }


        // Used when the Clear button is clicked in the Display Query.
        this.commonService.resetAllSimpleSearchEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.searchText = '';
                this.queryUrlService.clear( this.queryUrlService.SUBJECT_ID );

            }
        );

    }

    /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param {boolean} show
     */
    onShowSubjectIdsClick( show: boolean ) {
        this.showSubjectIds = show;
        this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_SUBJECT_ID, this.showSubjectIds );
    }

    /**
     * Clears the UI input, and sends an empty query via onSearchClick() to clear the Search results and Display query.
     */
    onClearClick() {
        this.searchText = '';
        this.onSearchClick();
    }

    /**
     * Get the list of IDs, split them on commas, and ad to the query.
     */
    onSearchClick() {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );

        // Comma delimited
        let subjectIdForQuery = this.searchText.replace( /^,?\s*,?/g, '' ).replace( /\s*,\s*/g, ',' ).replace( /\s*$/, '' ).split( ',' );
        let queryUrlString = '';
        for( let id of subjectIdForQuery ){
            queryUrlString += ',' + id;
        }

        if( this.searchText.length > 0 ){
            this.queryUrlService.update( this.queryUrlService.SUBJECT_ID, queryUrlString.substr( 1 ) );
        }
        else{
            this.queryUrlService.clear( this.queryUrlService.SUBJECT_ID );
        }

        // If subjectIdForQuery is empty we need to send send empty query
        if( (subjectIdForQuery.length === 1) && (subjectIdForQuery[0].length === 0) ){
            subjectIdForQuery = [];
            subjectIdForQuery[0] = Consts.PATIENT_CRITERIA;
        }
        else{
            subjectIdForQuery.unshift( Consts.PATIENT_CRITERIA );
        }

        // Add it to the query
        this.commonService.updateQuery( subjectIdForQuery );
    }

    onInputClearClick( totalClear: boolean ) {
        this.commonService.setHaveUserInput( true );
        this.searchText = '';
        this.queryUrlService.clear( this.queryUrlService.SUBJECT_ID );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
