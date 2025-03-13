import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Consts } from '@app/consts';
import { UtilService } from '@app/common/services/util.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nbia-images-desciption-search',
  templateUrl: './images-desciption-search.component.html',
  styleUrls: ['../images-search-tab.component.scss', './images-desciption-search.component.scss']
})

export class ImagesDesciptionSearchComponent implements OnInit, OnDestroy{

    showImagesDescriptionExplanation = false;
    posY = 0;

    /**
     * For hide or show this group of criteria when the arrows next to the heading are clicked.
     */
    showImageDescriptions;

    /**
     * The comma separated list of Description keywords to search for.  This is bound to the UI input.
     * @type {string}
     */
    searchText = '';
    subjectText = '';

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private parameterService: ParameterService,
                 private queryUrlService: QueryUrlService, private apiServerService: ApiServerService,
                 private initMonitorService: InitMonitorService, private utilService: UtilService ) {
    }

    ngOnInit() {

        this.parameterService.parameterImageDescriptionEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.searchText = <string>data;
                this.onSearchClick();
                this.commonService.setHaveUserInput( false );

            }
        );

        // Get persisted showCriteriaList value.  Used to show, or collapse this category of criteria in the UI.
        this.showImageDescriptions = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_IMAGE_DESCRIPTION );
        if( this.utilService.isNullOrUndefined( this.showImageDescriptions ) ){
            this.showImageDescriptions = Consts.SHOW_CRITERIA_QUERY_IMAGE_DESCRIPTION_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_IMAGE_DESCRIPTION, this.showImageDescriptions );
        }


        this.commonService.showImageDescriptionExplanationEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showImagesDescriptionExplanation = <boolean>data;
            }
        );


        // Used when the Clear button is clicked in the Display Query.
        this.commonService.resetAllSimpleSearchEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.searchText = '';
                this.queryUrlService.clear( this.queryUrlService.IMAGE_DESCRIPTION );
            }
        );

        this.initMonitorService.setImageDescriptionInit( true );

    }

    /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param {boolean} show
     */
    onShowImageDescriptionsClick( show: boolean ) {
        this.showImageDescriptions = show;
        this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_IMAGE_DESCRIPTION, this.showImageDescriptions );
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
        let imageDescriptionForQuery = this.searchText.replace( /^,?\s*,?/g, '' ).replace( /\s*,\s*/g, ',' ).replace( /\s*$/, '' ).split( ',' );
        let queryUrlString = '';
        for( let id of imageDescriptionForQuery ){
            queryUrlString += ',' + id;
        }

        if( this.searchText.length > 0 ){
            this.queryUrlService.update( this.queryUrlService.IMAGE_DESCRIPTION, queryUrlString.substr( 1 ) );
        }
        else{
            this.queryUrlService.clear( this.queryUrlService.IMAGE_DESCRIPTION );
        }

        // If imageDescriptionForQuery is empty we need to send send empty query
        if( (imageDescriptionForQuery.length === 1) && (imageDescriptionForQuery[0].length === 0) ){
            imageDescriptionForQuery = [];
            imageDescriptionForQuery[0] = Consts.IMAGE_DESCRIPTION_CRITERIA;
        }
        else{
            imageDescriptionForQuery.unshift( Consts.IMAGE_DESCRIPTION_CRITERIA );
        }

        // Add it to the query
        this.commonService.updateQuery( imageDescriptionForQuery );
    }

    onInputClearClick( totalClear: boolean ) {
        this.commonService.setHaveUserInput( true );
        this.searchText = '';
        this.queryUrlService.clear( this.queryUrlService.IMAGE_DESCRIPTION );
    }

    onImagesDescriptioneExplanationClick(e) {
        this.showImagesDescriptionExplanation = true;
        this.posY = e.view.pageYOffset + e.clientY;
    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
