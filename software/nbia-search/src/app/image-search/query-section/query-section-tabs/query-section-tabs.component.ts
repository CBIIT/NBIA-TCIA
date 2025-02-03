import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { CommonService } from '@app/image-search/services/common.service';
import { Consts } from '@app/consts';
import { PersistenceService } from '@app/common/services/persistence.service';
import { UtilService } from '@app/common/services/util.service';
import { Properties } from '@assets/properties';
import { ParameterService } from '@app/common/services/parameter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-query-section-tabs',
    templateUrl: './query-section-tabs.component.html',
    styleUrls: ['../../image-search.component.scss', './query-section-tabs.component.scss']
} )

export class QuerySectionTabsComponent implements OnInit, OnDestroy{

    /**
     * Set from PersistenceService, or Consts.SEARCH_TYPE_DEFAULT.
     * Used to set the initial search tab via onTabClick( this.currentQueryTypeTab )
     */
    currentQueryTypeTab;

    /**
     * Used to programmatically set the active tab in the HTML.
     *
     * @type {Array}
     */
    tabIsActive: boolean[] = [];

    //showQueryBuilder = Properties.SHOW_QUERY_BUILDER;
    showSubjectsTab = Properties.SHOW_SUBJECTS_TAB;
    showImagesTab = Properties.SHOW_IMAGES_TAB;
    showSearchSharedListSearch = Properties.SHOW_SEARCH_SHARED_LIST_TAB;
    showSearchStudySearch = Properties.SHOW_SEARCH_STUDY_TAB;

    displayMode;

    SIMPLE_SEARCH = 0;
    // TEXT_SEARCH = 1;
    // QUERY_BUILDER = 2;
    SUBJECTS_TAB = 1;
    IMAGES_TAB = 2;
    SHARED_LISTS = 3;
    STUDY = 4;

    /**
     * This is a quick fix needed for now as we transition to Pages Search.
     * Currently paged search breaks Text search, so we will set PAGED_SEARCH to false while in Text Search.
     * This will hold the value we will switch back to when leaving Text Search.
     */
    pagedSearchHold = Properties.PAGED_SEARCH;

    activeTab = 0;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private apiServerService: ApiServerService,
                 private persistenceService: PersistenceService, private parameterService: ParameterService,
                 private utilService: UtilService ) {
        // Create and initialize
        this.tabIsActive[this.SIMPLE_SEARCH] = true;
        this.tabIsActive[this.SUBJECTS_TAB] = true;
        this.tabIsActive[this.IMAGES_TAB] = true;
        this.tabIsActive[this.SHARED_LISTS] = true;
        this.tabIsActive[this.STUDY] = true;
    }

    ngOnInit() {

        // This allows other components to switch the Search type tabs.
        this.commonService.resultsDisplayModeEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {

                this.displayMode = data;
                if( this.displayMode === Consts.SIMPLE_SEARCH ){
                    this.tabIsActive[this.SIMPLE_SEARCH] = true;
                    this.tabIsActive[this.SUBJECTS_TAB] = false;
                    this.tabIsActive[this.IMAGES_TAB] = false;
                    this.tabIsActive[this.SHARED_LISTS] = false;
                    this.tabIsActive[this.STUDY] = false;
                    Properties.PAGED_SEARCH = this.pagedSearchHold;
                }
        //         else if( this.displayMode === Consts.SUBJECTS_TAB ){
        //             this.tabIsActive[this.SIMPLE_SEARCH] = false;
        //             this.tabIsActive[this.SUBJECTS_TAB] = true;
        //             this.tabIsActive[this.IMAGES_TAB] = false;
        //             this.tabIsActive[this.SHARED_LISTS] = false;
        //             this.tabIsActive[this.STUDY] = false;
        //             Properties.PAGED_SEARCH = false;
        //         }
            }
        );


        // Set the current tab from persisted setting, if there is one
        try{
            this.currentQueryTypeTab = JSON.parse( this.persistenceService.get( this.persistenceService.Field.QUERY_TYPE_TAB ) );
           // this.currentQueryTypeTab = 0;
            this.displayMode = this.currentQueryTypeTab;
        }catch( e ){
        }

        if( this.utilService.isNullOrUndefined( this.currentQueryTypeTab ) || (this.currentQueryTypeTab.length < 1) ){
            this.currentQueryTypeTab = 0; // Consts.SEARCH_TYPE_DEFAULT;
        }

        // If a disabled tab was saved and is now trying to restore from the persistenceService we need to set the tab to something else.
        if(
            (!Properties.SHOW_IMAGES_TAB && this.currentQueryTypeTab === this.IMAGES_TAB) ||
            (!Properties.SHOW_SEARCH_STUDY_TAB && this.STUDY === this.IMAGES_TAB) ||
            (!Properties.SHOW_SEARCH_SHARED_LIST_TAB && this.currentQueryTypeTab === this.SHARED_LISTS)
        ){
            this.currentQueryTypeTab = 0; // Consts.SEARCH_TYPE_DEFAULT;
        }


        // If there are URL parameters set the tab to Simple Search.
        // Keep this last, this must over ride any other changes to this.currentQueryTypeTab.
        if( this.parameterService.getParameterStatus() ){
            this.currentQueryTypeTab = this.SIMPLE_SEARCH;
        }

        // if( this.displayMode === Consts.TEXT_SEARCH ){
        //     Properties.PAGED_SEARCH = false;
        // }

        this.onTabClick( this.currentQueryTypeTab );
    }

    /**
     * Sets up Search results for the selected query type.
     *
     * @param i
     */
    onTabClick( i ) {
        this.activeTab = i;
        this.setTab( i );
        Properties.PAGED_SEARCH = this.pagedSearchHold;
        this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
        this.commonService.selectDataTab( this.commonService.getSimpleSearchDataTab() ); // FIXME this should be a const

        // Change/Update the results to display
        this.apiServerService.simpleSearchResultsEmitter.emit( this.commonService.getSimpleSearchResults() );

        // There is no query we need to set the results count to -1 which will cause thing to be displayed for results count rather than count of 0
        if( (this.utilService.isNullOrUndefined( this.commonService.getCurrentSimpleSearchQuery() )) || (this.commonService.getCurrentSimpleSearchQuery().length < 1) ){
            this.commonService.updateSearchResultsCount( -1 );
        }
    /*
      
        switch( i ){
            case 0: // 'Simple Search'
                // Change the table display.
                Properties.PAGED_SEARCH = this.pagedSearchHold;
                this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
                this.commonService.selectDataTab( this.commonService.getSimpleSearchDataTab() ); // FIXME this should be a const

                // Change/Update the results to display
                this.apiServerService.simpleSearchResultsEmitter.emit( this.commonService.getSimpleSearchResults() );

                // There is no query we need to set the results count to -1 which will cause thing to be displayed for results count rather than count of 0
                if( (this.utilService.isNullOrUndefined( this.commonService.getCurrentSimpleSearchQuery() )) || (this.commonService.getCurrentSimpleSearchQuery().length < 1) ){
                    this.commonService.updateSearchResultsCount( -1 );
                }
                break;

            case 1: // 'SUBJECTS-TAB',  not 'Text'
                // Change the table display.
               // Properties.PAGED_SEARCH = false;
                this.commonService.setResultsDisplayMode( Consts.SIMPLE_SEARCH );
                //this.commonService.selectDataTab( this.commonService.getSimpleSearchDataTab() ); // FIXME this should be a const


                // Change/Update the results to display
               // this.apiServerService.textSearchResultsEmitter.emit( this.commonService.getSimpleSearchResults() );

                // There is no query we need to set the results count to -1 which will cause thing to be disolayed for results count rather than count of 0
                if( (this.utilService.isNullOrUndefined( this.commonService.getCurrentSimpleSearchQuery() )) || (this.commonService.getCurrentSimpleSearchQuery().length < 1) ){
                    this.commonService.updateSearchResultsCount( -1 );
                }
                break;


            case 2: // 'Criteria Search'
                // Change the table display.
                Properties.PAGED_SEARCH = this.pagedSearchHold;
                this.commonService.setResultsDisplayMode( Consts.CRITERIA_SEARCH );
                // Change/Update the results to display
                this.apiServerService.criteriaSearchResultsEmitter.emit( this.commonService.getCriteriaSearchResults() );
                break;

            case 3: // 'Shared List Search'
                // Change the table display.
                Properties.PAGED_SEARCH = this.pagedSearchHold;
                this.commonService.setResultsDisplayMode( Consts.SHARED_LIST_SEARCH );
                // Change/Update the results to display
                // this.apiServerService.criteriaSearchResultsEmitter.emit( this.commonService.getCriteriaSearchResults() );
                break;

            case 4: // 'Study Search'
                // Change the table display.
                Properties.PAGED_SEARCH = this.pagedSearchHold;
                this.commonService.setResultsDisplayMode( Consts.STUDY_SEARCH );
                // Change/Update the results to display
                // this.apiServerService.criteriaSearchResultsEmitter.emit( this.commonService.getCriteriaSearchResults() );
                break;

        } 
                */
    }

    /**
     * For when we need to change the tab without the user clicking on it.
     *
     * @param i
     */
    setTab( i ) {
        // Save this tab, we will return to this same tab when the site is reloaded/restarted
        this.persistenceService.put( this.persistenceService.Field.QUERY_TYPE_TAB, i );

        for( let f = 0; f < this.tabIsActive.length; f++ ){
            this.tabIsActive[f] = (f === +i);
        }
    }

    onCloserClick() {
        this.commonService.showQuerySection( false );
    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
