import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { UtilService } from '@app/common/services/util.service';

import { Subject } from 'rxjs';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-display-query-simple-search',
    templateUrl: './display-query-simple-search.component.html',
    styleUrls: ['../display-query.component.scss']
} )
export class DisplayQuerySimpleSearchComponent implements OnInit, OnDestroy{

    /**
     * The data received by updateSimpleSearchQueryForDisplayEmitter.subscribe.
     *
     * @type {Array}
     */
    criteriaList = [];

    maxVals = 5;


    /**
     * The data organized for display.
     *
     * @type {Array}
     */
    allCriteriaList = [];

    properties = Properties;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();


    // For access in the HTML. The AOT compiler setting can't have any private objects in the HTML
    comService;

    constructor( private commonService: CommonService, private apiServerService: ApiServerService ) {
        this.comService = commonService;
    }

    /**
     * All the Simple Search categories Ex.: Anatomical Site, Image Modality, etc.
     */
    ngOnInit() {
        this.commonService.updateSimpleSearchQueryForDisplayEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.criteriaList = <any>data;
                this.populateCriteriaLists();
            }
        );
    }


    /**
     * Group all the different search criteria into a two dimensional array for display.
     * First element of each row is the category name, the rest are the selected criteria for that category.
     */
    populateCriteriaLists() {
        this.allCriteriaList = [];

        // Populate populateCriteriaLists
        for( let criteria of this.criteriaList ){

            // The first element of each array is the category name.
            // Do we have this category of criteria one yet?
            let haveIt = false;
            for( let f = 0; f < this.allCriteriaList.length; f++ ){

                // If we already have this category, "f" is now the index of that (category) row, just add the criteria.
                if( this.allCriteriaList[f][0] === criteria['criteria'] ){
                    haveIt = true;
                    this.allCriteriaList[f].push( criteria.name );
                }
            }

            // If we don't already have this category, add it's name (criteria['criteria']) as the first element of a new (category) row,
            // then add the criteria.
            if( !haveIt ){
                this.allCriteriaList.push( [criteria['criteria']] );
                // This newly added row will be the last one in the array, so it's index is "this.allCriteriaList.length - 1"
                this.allCriteriaList[this.allCriteriaList.length - 1].push( criteria.name );
            }
        }
    }


    onClearSimpleSearchQueryClick() {
        this.apiServerService.setSimpleSearchQueryHold( null );
        this.commonService.updateSearchResultsCount( -1 );
        this.commonService.resetAllSimpleSearch();
    }

    /**
     * Adds a space before and after ||
     *
     * @param {string} q  String that (might) contain ||
     * @returns {string}  String with spaces before and after.
     */
    cleanQuery( q: string ) {
        return q.slice().replace( new RegExp( '\\|\\|', 'g' ), ' \|\| ' );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
