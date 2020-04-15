import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Consts, SortState } from '@app/constants';
import { Properties } from '@assets/properties';
import { CineModeService } from '../../cine-mode-module/cine-mode/cine-mode.service';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';
import { PersistenceService } from '@app/admin-common/services/persistence.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { LoadingDisplayService } from '@app/admin-common/components/loading-display/loading-display.service';
import { ModalityDescriptionsService } from '@app/tools/search-results-section-module/services/modality-descriptions.service';
import { SearchResultByIndexService } from '@app/tools/search-results-section-module/services/search-result-by-index.service';

@Component( {
    selector: 'nbia-search-results-section',
    templateUrl: './search-results-section.component.html',
    styleUrls: ['./search-results-section.component.scss']
} )
export class SearchResultsSectionComponent implements OnInit{

    searchResults = [];
    currentCineModeSeriesIndex = -1;
    // I don't want to use searchResults.length in the HTML
    searchResultsCount = 0;
    properties = Properties;
    checkboxCount = 0;
    masterSearchResultsCheckbox = false;
    noSearch = true;

    // @TODO init from cookie if there.
    columnHeadings = [
        { 'name': 'Submission date', 'sortState': SortState.SORT_DOWN },  // Default  TODO save and restore from browser cookie
        // { 'name': 'Trial ID', 'sortState': SortState.NO_SORT },
        // { 'name': 'Collection//Site', 'sortState': SortState.NO_SORT },
        { 'name': 'Patient', 'sortState': SortState.NO_SORT },
        { 'name': 'Study', 'sortState': SortState.NO_SORT },
        { 'name': 'Series', 'sortState': SortState.NO_SORT },
        { 'name': 'Series Description', 'sortState': SortState.NO_SORT },
        { 'name': 'Modality', 'sortState': SortState.NO_SORT },
        { 'name': 'Visibility', 'sortState': SortState.NO_SORT },
        { 'name': 'Viewers', 'sortState': SortState.NO_SORT }
    ];

    sortState = SortState;
    collectionSite = '';
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    @Output() resultsUpdateEmitter = new EventEmitter(); // Used by Input in PerformQcBulkOperationsComponent
    @Output() resultsSelectCountUpdateEmitter = new EventEmitter(); // Used by Input in PerformQcBulkOperationsComponent

    constructor( private apiService: ApiService, private cineModeService: CineModeService,
                 private accessTokenService: AccessTokenService, private persistenceService: PersistenceService,
                 private utilService: UtilService, private loadingDisplayService: LoadingDisplayService,
                 private modalityDescriptionsService: ModalityDescriptionsService, private searchResultByIndexService: SearchResultByIndexService ) {
    }

    async ngOnInit() {
        // Check for config file which will take precedence
        let runaway = 100; // Just in case.
        while( (!Properties.CONFIG_COMPLETE) && (runaway > 0) ){
            await this.utilService.sleep( Consts.waitTime );  // Wait 50ms
            runaway--;
        }

        this.searchResultByIndexService.searchResultsByIndexEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( this.currentCineModeSeriesIndex < ( this.searchResults.length - 1) ){
                    this.currentCineModeSeriesIndex++;
                    this.cineModeService.openCineMode( this.searchResults[this.currentCineModeSeriesIndex], this.collectionSite, this.currentCineModeSeriesIndex );
                }
            });

        // closeCineModeEmitter
        this.cineModeService.closeCineModeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.currentCineModeSeriesIndex = -1;
            });

        this.apiService.searchResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( data[0] === Consts.NO_SEARCH ){
                    this.noSearch = true;
                    data = [];
                }else{
                    this.noSearch = false;
                }

                this.searchResults = data;
                this.searchResultsCount = this.searchResults.length;

                // Add/initialize 'selected', 'modalityDescription', and 'showOhif' fields
                for( let i = 0; i < this.searchResults.length; i++ ){
                    this.searchResults[i]['selected'] = false;
                    this.searchResults[i]['modalityDescription'] = this.modalityDescriptionsService.getModalityDescription( this.searchResults[i]['modality'] );
                    this.searchResults[i]['showOhif'] = Properties.SHOW_OHIF_VIEWER &&
                        (!this.utilService.isNullOrUndefinedOrEmpty( Properties.OHIF_MODALITIES.find( m => m === this.searchResults[i].modality.toUpperCase() ) ));
                }

                // (re)initialize top checkbox in table heading.
                this.masterSearchResultsCheckbox = false;
                this.checkboxCount = 0;
                this.doInitSort();
                this.resultsUpdateEmitter.emit( this.searchResults );
                this.loadingDisplayService.setLoading( false );

            } );

        this.apiService.collectionSiteEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.collectionSite = data;
            } );

        // @ts-ignore
        $( function() {
            // @ts-ignore
            $( '#normal' ).colResizable( {
                liveDrag: true,
                gripInnerHtml: '<div class=\'grip\'></div>',
                draggingClass: 'dragging',
                resizeMode: 'fit'
            } );

            // @ts-ignore
            $( '#flex' ).colResizable( {
                liveDrag: true,
                gripInnerHtml: '<div class=\'grip\'></div>',
                draggingClass: 'dragging',
                resizeMode: 'flex'
            } );


            // @ts-ignore
            $( '#overflow' ).colResizable( {
                liveDrag: true,
                gripInnerHtml: '<div class=\'grip\'></div>',
                draggingClass: 'dragging',
                resizeMode: 'overflow'
            } );


            // @ts-ignore
            $( '#disabled' ).colResizable( {
                liveDrag: true,
                gripInnerHtml: '<div class=\'grip\'></div>',
                draggingClass: 'dragging',
                resizeMode: 'overflow',
                disabledColumns: [2]
            } );


        } );

    }

    toggleTopSearchResultsCheckbox( c ) {
        // If they are not all selected, checking this box turns them all on
        if( this.areAnyUnchecked() ){
            for( let i = 0; i < this.searchResults.length; i++ ){
                this.setCheckbox( i, true );
            }
            this.masterSearchResultsCheckbox = true;
            this.checkboxCount = this.searchResults.length;
        }else{
            for( let i = 0; i < this.searchResults.length; i++ ){
                this.setCheckbox( i, false );
            }
            this.masterSearchResultsCheckbox = false;
            this.checkboxCount = 0;
        }
        this.resultsSelectCountUpdateEmitter.emit( this.checkboxCount );

    }

    toggleSearchResultsCheckbox( i, c ) {
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

    getSelectedCheckboxCount() {
        this.checkboxCount = 0;
        for( let state of this.searchResults ){
            if( state['selected'] ){
                this.checkboxCount++;
            }
        }
        this.resultsSelectCountUpdateEmitter.emit( this.checkboxCount );
    }


    areAnyUnchecked() {
        let anyUnchecked = false;
        for( let state of this.searchResults ){
            if( !state['selected'] ){
                anyUnchecked = true;
            }
        }
        return anyUnchecked;
    }

    setCheckbox( i, state ) {
        this.searchResults[i]['selected'] = state;
        this.resultsUpdateEmitter.emit( this.searchResults );

    }

    // Cine-mode viewer
    onClickCineMode( i ) {
        this.currentCineModeSeriesIndex = i;
        this.cineModeService.openCineMode( this.searchResults[i], this.collectionSite, i );
    }

    // nbia-viewer
    onThumbnailClick( i ) {
        window.open( Properties.API_SERVER_URL +
            '/nbia-viewer/?thumbnailSeries=' +
            encodeURI( this.searchResults[i]['seriesPkId'] ) +
            '&thumbnailDescription=' +
            encodeURI( this.searchResults[i]['seriesDescription'] ) +
            '&accessToken=' + this.accessTokenService.getAccessToken(),
            '_blank' );
    }


    // OHIF Viewer
    onOhifViewerClick( i ) {
        let ohifUrl = Properties.OHIF_SERVER_URL + '/viewer?study=' + this.searchResults[i]['study'] + '&series=' + this.searchResults[i]['series'] + '&token=' + this.accessTokenService.getAccessToken();
        window.open( ohifUrl, '_blank' );
    }

    onHeadingClick( i ) {
        // There are no results or this a non-sortable column don't do the sort.
        if( (this.searchResultsCount > 0) && (this.columnHeadings[i]['name'] !== 'Collection//Site' && this.columnHeadings[i]['name'] !== 'Viewers') ){
            // Is this column the current sorting column
            if( this.columnHeadings[i]['sortState'] === SortState.NO_SORT ){
                // Clear all sort states
                for( let state of this.columnHeadings ){
                    state['sortState'] = SortState.NO_SORT;
                }
                this.columnHeadings[i]['sortState'] = SortState.SORT_DOWN;
            }else{
                if( this.columnHeadings[i]['sortState'] === SortState.SORT_DOWN ){
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
    doInitSort() {
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
    doSort( column ) {
        this.loadingDisplayService.setLoading( true, 'Sorting...' );
        // Use name instead of index in case we make column order changeable.
        switch( this.columnHeadings[column]['name'] ){
            case 'Submission date':
                this.searchResults.sort( ( row1, row2 ) => <any>new Date( row1.dateTime.replace( /[APap](M|m) *$/, '' ) ) -
                    <any>(new Date( row2.dateTime.replace( /[APap](M|m) *$/, '' ) )) *
                    ((this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN) ? -1 : 1) );
                break;

            case 'Trial ID':
                this.searchResults.sort( ( row1, row2 ) => row1.trialDpPkId.localeCompare( row2.trialDpPkId ) *
                    ((this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN) ? -1 : 1) );
                break;

            // There can only be one of these so no sorting for this column
            case 'Collection//Site':
                break;

            case 'Study':
                this.searchResults.sort( ( row1, row2 ) => row1.study.localeCompare( row2.study ) *
                    ((this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN) ? -1 : 1) );
                break;

            case 'Patient':
                this.searchResults.sort( ( row1, row2 ) => row1.patientId.localeCompare( row2.patientId ) *
                    ((this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN) ? -1 : 1) );
                break;

            case 'Series':
                this.searchResults.sort( ( row1, row2 ) => row1.series.localeCompare( row2.series ) *
                    ((this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN) ? -1 : 1) );
                break;

            case 'Series Description':
                // this.searchResults.sort( ( row1, row2 ) => row1.seriesDescription.localeCompare( row2.seriesDescription ) *
                this.searchResults.sort( ( row1, row2 ) => (this.utilService.isNullOrUndefinedOrEmpty( row1.seriesDescription ) ? '' : row1.seriesDescription).localeCompare( (this.utilService.isNullOrUndefinedOrEmpty( row2.seriesDescription ) ? '' : row2.seriesDescription) ) *
                    ((this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN) ? -1 : 1) );
                break;

            case 'Modality':
                this.searchResults.sort( ( row1, row2 ) => (this.utilService.isNullOrUndefinedOrEmpty( row1.modality ) ? '' : row1.modality).localeCompare( (this.utilService.isNullOrUndefinedOrEmpty( row2.modality ) ? '' : row2.modality) ) *
                    ((this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN) ? -1 : 1) );
                break;

            case 'Visibility':
                this.searchResults.sort( ( row1, row2 ) => (this.utilService.isNullOrUndefinedOrEmpty( row1.visibilityStatus ) ? '' : row1.visibilityStatus).localeCompare( (this.utilService.isNullOrUndefinedOrEmpty( row2.visibilityStatus ) ? '' : row2.visibilityStatus) ) *
                    ((this.columnHeadings[column]['sortState'] === SortState.SORT_DOWN) ? -1 : 1) );
                break;
        }
        this.loadingDisplayService.setLoading( false );
    }
}
