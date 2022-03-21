// ----------------------------------------------------------------------------------------------------
// -----------------                 Search results section                          ------------------
// -----------------     used by "Perform Quality Control" and "Approve Deletions"   ------------------
// ----------------------------------------------------------------------------------------------------

import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { Properties } from '@assets/properties';
import { Consts, SortState } from '@app/constants';
import { Subject } from 'rxjs';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';
import { PersistenceService } from '@app/admin-common/services/persistence.service';
import { LoadingDisplayService } from '@app/admin-common/components/loading-display/loading-display.service';
import { ModalityDescriptionsService } from '@app/tools/search-results-section-module/services/modality-descriptions.service';
import { SearchResultByIndexService } from '@app/tools/search-results-section-module/services/search-result-by-index.service';
import { takeUntil } from 'rxjs/operators';
import { CineModeBravoService } from '@app/tools/cine-mode-module/cine-mode-bravo/cine-mode-bravo.service';
import { IKeyboardShortcutListenerOptions, KeyboardKeys, } from 'ngx-keyboard-shortcuts';
import { PreferencesService } from '@app/preferences/preferences.service';
import { SearchResultsPagerService } from '@app/tools/search-results-section-module/search-results-pager/search-results-pager.service';
import { SearchResultsSectionBravoService } from '@app/tools/search-results-section-module/search-results-section-bravo/search-results-section-bravo.service';


@Component( {
    selector: 'nbia-search-results-section-bravo',
    templateUrl: './search-results-section-bravo.component.html',
    styleUrls: ['./search-results-section-bravo.component.scss'],
} )

export class SearchResultsSectionBravoComponent implements OnInit, OnDestroy{
    @ViewChild( 'scrollMe', { static: true } ) private myScrollContainer: ElementRef;
    searchResultsSelectedCount = 0;
    searchResults = [];
    currentCineModeSeriesIndex = -1;

    searchResultsPageToDisplay = [];
    pageLength = Properties.DEFAULT_PAGE_LENGTH;
    maxPageLength = Properties.MAX_PAGE_LENGTH;
    currentPage = 0;
    pageCount = 0;
    totalCount = 0;

    // I don't want to use searchResults.length in the HTML
    searchResultsCount = 0;
    checkboxCount = 0;
    masterSearchResultsCheckbox = false;
    noSearch = true;

    showSelectDropdown = false;

    // @TODO init from browser cookie if there.
    columnHeadings = [
        { name: 'Submission date', sortState: SortState.SORT_DOWN }, // Default  TODO save and restore from browser cookie
        // { 'name': 'Trial ID', 'sortState': SortState.NO_SORT },
        // { 'name': 'Collection//Site', 'sortState': SortState.NO_SORT },
        { name: 'Subject ID', sortState: SortState.NO_SORT },
        { name: 'Study', sortState: SortState.NO_SORT },
        { name: 'Series', sortState: SortState.NO_SORT },
        { name: 'Description', sortState: SortState.NO_SORT },
        { name: 'Modality', sortState: SortState.NO_SORT },
        { name: 'Visibility', sortState: SortState.NO_SORT },
        { name: 'View', sortState: SortState.NO_SORT },
    ];

    sortState = SortState;
    collectionSite = '';
    currentFont;
    properties = Properties;

    // The keyboard shortcut to show and hide the Cine mode viewer
    // @TODO consult with users to determine the best key combination that isn't already doing something else.
    keyboardShortcutDef: IKeyboardShortcutListenerOptions = {
        description: 'save',
        // keyBinding: [KeyboardKeys.Ctrl, KeyboardKeys.Shift, 'q']
        // keyBinding: [KeyboardKeys.Ctrl, '1'],
        keyBinding: [KeyboardKeys.Ctrl, Properties.CINE_MODE_TOGGLE_KEY],
    };

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    // Passing resultsUpdateBravoEmitter to child
    @Output() resultsUpdateBravoEmitter = new EventEmitter(); // Used by Input in PerformQcBulkOperationsComponent
    @Output() resultsSelectCountUpdateBravoEmitter = new EventEmitter(); // Used by Input in PerformQcBulkOperationsComponent

    constructor(
        private apiService: ApiService,
        private cineModeService: CineModeBravoService,
        private accessTokenService: AccessTokenService,
        private persistenceService: PersistenceService,
        private utilService: UtilService,
        private loadingDisplayService: LoadingDisplayService,
        private modalityDescriptionsService: ModalityDescriptionsService,
        private searchResultByIndexService: SearchResultByIndexService,
        private preferencesService: PreferencesService,
        private searchResultsSectionBravoService: SearchResultsSectionBravoService,
        private searchResultsPagerService: SearchResultsPagerService
    ){
    }

    async ngOnInit(){
        // Check for config file which will take precedence
        let runaway = 100; // Just in case.
        while( !Properties.CONFIG_COMPLETE && runaway > 0 ){
            await this.utilService.sleep( Consts.waitTime ); // Wait 50ms
            runaway--;
        }

        this.searchResultsPagerService.currentPageChangeEmitter.pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.currentPage = data;
                this.setupPage();
            } );


        // @TODO Make sure this emitter name makes sense
        // Happens when Cinemode next/skip
        this.searchResultByIndexService.searchResultsByIndexEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe( ( data ) => {
            if( this.currentCineModeSeriesIndex < this.searchResults.length - 1 ){
                this.currentCineModeSeriesIndex++;
                this.cineModeService.openCineMode(
                    this.searchResults[this.currentCineModeSeriesIndex],
                    this.collectionSite,
                    this.currentCineModeSeriesIndex
                );

                // Do we need to go to next page?
                if( this.currentCineModeSeriesIndex >= ((this.currentPage + 1) * this.pageLength) ){
                    this.searchResultsPagerService.goToNextPage();
                }
            }
        } );

        // closeCineModeEmitter
        this.cineModeService.closeCineModeEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( () => {
                this.currentCineModeSeriesIndex = -1;
            } );


        // New search results have arrived.
        this.apiService.searchResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                if( data[0] === Consts.NO_SEARCH ){
                    this.noSearch = true;
                    data = [];
                }else{
                    this.noSearch = false;
                }

                this.searchResults = data;
                this.totalCount = this.searchResults.length;
                this.searchResultsCount = this.searchResults.length;
                this.pageCount = Math.ceil( this.searchResultsCount / this.pageLength );
                this.searchResultsPagerService.setPageCount( this.pageCount );


                // Add/initialize 'selected', 'modalityDescription', and 'showOhif' fields
                for( let i = 0; i < this.searchResults.length; i++ ){
                    this.searchResults[i]['selected'] = false;
                    this.searchResults[i][
                        'modalityDescription'
                        ] = this.modalityDescriptionsService.getModalityDescription(
                        this.searchResults[i]['modality']
                    );
                    this.searchResults[i]['showOhif'] =
                        Properties.SHOW_OHIF_VIEWER &&
                        !this.utilService.isNullOrUndefinedOrEmpty(
                            Properties.OHIF_MODALITIES.find(
                                ( m ) =>
                                    m ===
                                    this.searchResults[i].modality.toUpperCase()
                            )
                        );
                }

                // (re)initialize top checkbox in table heading.
                this.masterSearchResultsCheckbox = false;
                this.checkboxCount = 0;
                this.doInitSort();
                this.resultsUpdateBravoEmitter.emit( this.searchResults );
                this.setupPage();

                this.loadingDisplayService.setLoading( false );
            } );

        this.apiService.collectionSiteEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.collectionSite = data;
            } );

        this.preferencesService.setFontSizePreferencesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.currentFont = data;
            } );

        // Get the initial value
        this.currentFont = this.preferencesService.getFontSize();

    }

    /**
     * @FIXME  This doesn't work!!!!!!
     */
    scrollToTop(): void{
        try{
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }catch( err ){
        }
    }


    toggleTopSearchResultsCheckbox( c ){
        // If they are not all selected, checking this box turns them all on
        if( this.areAnyUnchecked() ){
            for( let i = 0; i < this.searchResults.length; i++ ){
                this.setCheckbox( i, true );
            }
            this.masterSearchResultsCheckbox = true;
            this.checkboxCount = this.searchResults.length;
        }else
            // All are checked
        {
            for( let i = 0; i < this.searchResults.length; i++ ){
                this.setCheckbox( i, false );
            }
            this.masterSearchResultsCheckbox = false;
            this.checkboxCount = 0;
        }
        this.resultsSelectCountUpdateBravoEmitter.emit( this.checkboxCount );
    }


    toggleSelectPage(){

        if( this.areAnyUncheckedCurrentPage() ){

            for( let i = this.currentPage * this.pageLength; i < ((this.currentPage * this.pageLength) + this.pageLength); i++ ){
                this.setCheckbox( i, true );
            }

        }else
            // All on this page are checked
        {
            for( let i = this.currentPage * this.pageLength; i < ((this.currentPage * this.pageLength) + this.pageLength); i++ ){
                this.setCheckbox( i, false );
            }
        }
        this.getSelectedCheckboxCount();
    }

    toggleSelectAll(){
        // If they are not all selected, checking this box turns them all on
        if( this.areAnyUnchecked() ){
            for( let i = 0; i < this.searchResults.length; i++ ){
                this.setCheckbox( i, true );
            }
            this.masterSearchResultsCheckbox = true;
            this.checkboxCount = this.searchResults.length;
        }else
            // All are checked
        {
            for( let i = 0; i < this.searchResults.length; i++ ){
                this.setCheckbox( i, false );
            }
            this.masterSearchResultsCheckbox = false;
            this.checkboxCount = 0;
        }
        this.resultsSelectCountUpdateBravoEmitter.emit( this.checkboxCount );

    }


    toggleSearchResultsCheckbox( i, c ){
        this.setCheckbox( i, c );
        this.getSelectedCheckboxCount();

        if( !c ){
            this.masterSearchResultsCheckbox = false;
        }
        // If all the checkboxes are selected now, select the Top (All) Checkbox too.
        else{
            if( !this.areAnyUnchecked() ){
                this.masterSearchResultsCheckbox = true;
            }
        }
    }

    getSelectedCheckboxCount(){
        this.checkboxCount = 0;
        for( let state of this.searchResults ){
            if( state['selected'] ){
                this.checkboxCount++;
            }
        }
        this.resultsSelectCountUpdateBravoEmitter.emit( this.checkboxCount );
    }

    areAnyUnchecked(){
        let anyUnchecked = false;
        for( let state of this.searchResults ){
            if( !state['selected'] ){
                anyUnchecked = true;
            }
        }
        return anyUnchecked;
    }

    areAnyUncheckedCurrentPage(){
        let anyUnchecked = false;
        for( let state of this.searchResultsPageToDisplay ){
            if( !state['selected'] ){
                anyUnchecked = true;
            }
        }
        return anyUnchecked;
    }

    setCheckbox( i, state ){
        this.searchResults[i]['selected'] = state; // @TODO get this to  "Update Site"
        this.resultsUpdateBravoEmitter.emit( this.searchResults ); // @TODO replace this with a NON-Output emitter
        this.searchResultsSectionBravoService.selectionChange( this.searchResults ); // @TODO replace above with this

    }

    // Cine-mode viewer
    onClickCineMode( i ){
        i += (this.currentPage * this.pageLength);
        this.currentCineModeSeriesIndex = i;
        this.cineModeService.openCineMode(
            this.searchResults[i],
            this.searchResults[i]['collectionSite'],  // @TODO  this.collectionSite was previously used for this value, before it was a part of searchResults[i] - Clean that up
            i
        );
    }

    // nbia-viewer
    onThumbnailClick( i ){
        i += (this.currentPage * this.pageLength);
        window.open(
            Properties.API_SERVER_URL +
            '/nbia-viewer/?thumbnailSeries=' +
            encodeURI( this.searchResults[i]['seriesPkId'] ) +
            '&thumbnailDescription=' +
            encodeURI( this.searchResults[i]['seriesDescription'] ) +
            '&accessToken=' +
            this.accessTokenService.getAccessToken() + ':' +
            this.accessTokenService.getRefreshToken() + ':' +
            this.accessTokenService.getExpiresIn(),
            '_blank'
        );
    }

    // OHIF Viewer
    onOhifViewerClick( i ){
        i += (this.currentPage * this.pageLength);
        let ohifUrl =
            Properties.OHIF_SERVER_URL +
            '/viewer?study=' +
            this.searchResults[i]['study'] +
            '&series=' +
            this.searchResults[i]['series'] +
            '&token=' +
            this.accessTokenService.getAccessToken();
        window.open( ohifUrl, '_blank' );
    }

    onHeadingClick( i ){
        // There are no results or this a non-sortable column don't do the sort.
        if(
            this.searchResultsCount > 0 &&
            this.columnHeadings[i]['name'] !== 'Collection//Site' &&
            this.columnHeadings[i]['name'] !== 'Viewers'
        ){


            // Is this column the current sorting column
            if( this.columnHeadings[i]['sortState'] === SortState.NO_SORT ){
                // Clear all sort states
                for( let state of this.columnHeadings ){
                    state['sortState'] = SortState.NO_SORT;
                }
                this.columnHeadings[i]['sortState'] = SortState.SORT_DOWN;
            }else{
                if(
                    this.columnHeadings[i]['sortState'] === SortState.SORT_DOWN
                ){
                    this.columnHeadings[i]['sortState'] = SortState.SORT_UP;
                }else{
                    this.columnHeadings[i]['sortState'] = SortState.SORT_DOWN;
                }
            }

            this.doSort( i );
        }
    }

    /**
     * Initial sort when search results come back.
     */
    doInitSort(){
        let i = -1;
        for( let state of this.columnHeadings ){
            i++;
            if( state['sortState'] !== SortState.NO_SORT ){
                this.doSort( i );
            }
        }
    }

    /**
     * Sort when a heading is clicked.
     * @param column
     */
    doSort( column ){
        this.loadingDisplayService.setLoading( true, 'Sorting...' );

        // console.log('MHL this.columnHeadings[column][\'name\']: ', this.columnHeadings[column]['name']);
        // Use name instead of index in case we make column order changeable.
        switch( this.columnHeadings[column]['name'] ){
            case 'Submission date':
                this.searchResults.sort(
                    ( row1, row2 ): number => {
                        return (<any>new Date( row1['dateTime'].valueOf().replace( /[APap](M|m) *$/, '' ) ) - (<any>new Date( row2['dateTime'].valueOf().replace( /[APap](M|m) *$/, '' ) ))) *
                            (this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN ? -1 : 1);
                    }
                );
                break;

            case  'Trial ID':
                this.searchResults.sort(
                    ( row1, row2 ): number => {
                        return row1.trialDpPkId.localeCompare( row2.trialDpPkId ) *
                            (this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN ? -1 : 1);
                    } );
                break;

            // There can only be one of these so no sorting for this column
            case            'Collection//Site'            :
                break;

            case
            'Study'
            :
                this.searchResults.sort(
                    ( row1, row2 ) =>
                        row1.study.localeCompare( row2.study ) *
                        (this.columnHeadings[column]['sortState'] ===
                        SortState.SORT_DOWN
                            ? -1
                            : 1)
                );
                break;

            case 'Patient':
                this.searchResults.sort(
                    ( row1, row2 ) => {
                        return row1.patientId.localeCompare( row2.patientId ) * (this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN ? -1 : 1);
                    }
                );
                break;

            case 'Subject ID':
                this.searchResults.sort(
                    ( row1, row2 ) => {
                        return row1.patientId.localeCompare( row2.patientId ) * (this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN ? -1 : 1);
                    }
                );
                break;

            case
            'Series'
            :
                this.searchResults.sort(
                    ( row1, row2 ) =>
                        row1.series.localeCompare( row2.series ) *
                        (this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN ? -1 : 1)
                );
                break;

            case
            'Description'
            :
                // this.searchResults.sort( ( row1, row2 ) => row1.seriesDescription.localeCompare( row2.seriesDescription ) *
                this.searchResults.sort(
                    ( row1, row2 ) =>
                        (this.utilService.isNullOrUndefinedOrEmpty(
                                row1.seriesDescription
                            )
                                ? ''
                                : row1.seriesDescription
                        ).localeCompare(
                            this.utilService.isNullOrUndefinedOrEmpty(
                                row2.seriesDescription
                            )
                                ? ''
                                : row2.seriesDescription
                        ) *
                        (this.columnHeadings[column]['sortState'] ===
                        SortState.SORT_DOWN
                            ? -1
                            : 1)
                );
                break;

            case
            'Modality':
                this.searchResults.sort(
                    ( row1, row2 ) =>
                        (this.utilService.isNullOrUndefinedOrEmpty(
                                row1.modality
                            )
                                ? ''
                                : row1.modality
                        ).localeCompare(
                            this.utilService.isNullOrUndefinedOrEmpty(
                                row2.modality
                            )
                                ? ''
                                : row2.modality
                        ) *
                        (this.columnHeadings[column]['sortState'] ===
                        SortState.SORT_DOWN
                            ? -1
                            : 1)
                );
                break;

            case
            'Visibility'
            :
                this.searchResults.sort(
                    ( row1, row2 ) =>
                        (this.utilService.isNullOrUndefinedOrEmpty(
                                row1.visibilityStatus
                            )
                                ? ''
                                : row1.visibilityStatus
                        ).localeCompare(
                            this.utilService.isNullOrUndefinedOrEmpty(
                                row2.visibilityStatus
                            )
                                ? ''
                                : row2.visibilityStatus
                        ) *
                        (this.columnHeadings[column]['sortState'] ===
                        SortState.SORT_DOWN
                            ? -1
                            : 1)
                );
                break;
        }


        // @TODO Update the Page
        this
            .setupPage();

        this
            .loadingDisplayService
            .setLoading(
                false
            );
    }

    pageChanged( e ){
        this.setupPage();
    }

    onPageLengthChange(){
        if( this.pageLength < 1 ){
            this.pageLength = 1;
        }
        if( this.pageLength > this.maxPageLength ){
            this.pageLength = this.maxPageLength;
        }
        this.pageCount = Math.ceil( this.searchResultsCount / this.pageLength );
        this.searchResultsPagerService.setPageCount( this.pageCount );
        this.setupPage();
    }

    setupPage(){
        this.searchResultsPageToDisplay = this.searchResults.slice( this.pageLength * this.currentPage, this.pageLength * (this.currentPage + 1) );
        this.scrollToTop();
    }

    hideShowCineMode(){
        this.cineModeService.hideCineMode();
    }

    ngOnDestroy(){
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
