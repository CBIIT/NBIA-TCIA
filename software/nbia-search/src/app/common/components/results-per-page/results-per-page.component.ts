import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '@app/image-search/services/common.service';
import {PersistenceService} from '../../services/persistence.service';
import {Consts} from '../../../consts';
import { UtilService } from '@app/common/services/util.service';
import {Properties} from '@assets/properties';

@Component({
    selector: 'nbia-results-per-page',
    templateUrl: './results-per-page.component.html',
    styleUrls: ['../../../app.component.scss']
})

/**
 * The "Show XX entries" UI at the bottom left corner of the Search results and Cart List displays.
 * The Search results and Cart List displays are two different values, but they both use this UI component.
 */
export class ResultsPerPageComponent implements OnInit {

    rowsPerPage;

    /**
     * Search Results or Cart list.
     */
    @Input() displayDataType;

    constructor(private commonService: CommonService, private persistenceService: PersistenceService,
                private utilService: UtilService) {
    }

    ngOnInit() {

        // Set the current rows per page from persisted setting, if there is one, if not use Properties.ROWS_PER_PAGE_CHOICE_DEFAULT.
        if (this.displayDataType === Consts.DISPLAY_DATA_TYPE_SEARCH_RESULTS) {
            try {
                this.rowsPerPage = this.persistenceService.get(this.persistenceService.Field.SEARCH_RESULTS_ROWS_PER_PAGE);
                if(this.rowsPerPage < 1){
                    this.rowsPerPage = 1;
                }
            } catch (e) {
            }
        }
        else if (this.displayDataType === Consts.DISPLAY_DATA_TYPE_CART_LIST) {
            try {
                this.rowsPerPage = this.persistenceService.get(this.persistenceService.Field.CARTS_PER_PAGE);
                if(this.rowsPerPage < 1){
                    this.rowsPerPage = 1;
                }
            } catch (e) {
            }

        }

        if (this.utilService.isNullOrUndefined(this.rowsPerPage)) {
            this.rowsPerPage = Properties.ROWS_PER_PAGE_CHOICE_DEFAULT;
            if(this.rowsPerPage < 1){
                this.rowsPerPage = 1;
            }
        }
        this.onChangeResultsPerPage();
    }


    /**
     * The results per page has changed.
     */
    onChangeResultsPerPage() {
        if(this.rowsPerPage < 1){
            this.rowsPerPage = 1;
        }


        if(this.rowsPerPage > Properties.ROWS_PER_PAGE_LIMIT){
            this.rowsPerPage = Properties.ROWS_PER_PAGE_LIMIT;
        }


        // Is it for Search Results?
        if (this.displayDataType === Consts.DISPLAY_DATA_TYPE_SEARCH_RESULTS) {
            this.commonService.updateSearchResultsPerPage(this.rowsPerPage);
            this.persistenceService.put(this.persistenceService.Field.SEARCH_RESULTS_ROWS_PER_PAGE, this.rowsPerPage);
        }
        // Is it for Cart List?
        else if (this.displayDataType === Consts.DISPLAY_DATA_TYPE_CART_LIST) {
            this.commonService.updateCartsPerPage(this.rowsPerPage);
            this.persistenceService.put(this.persistenceService.Field.CARTS_PER_PAGE, this.rowsPerPage);
        }
    }
}
