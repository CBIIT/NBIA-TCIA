import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { QuerySectionService } from '@app/tools/query-section-module/services/query-section.service';
import { LoginService } from '@app/login/login.service';

@Component({
  selector: 'nbia-search-results-section-bravo',
  templateUrl: './search-results-section-bravo.component.html',
  styleUrls: ['./search-results-section-bravo.component.scss']
})
export class SearchResultsSectionBravoComponent implements OnInit {
    searchResults = [];
    currentCineModeSeriesIndex = -1;
    searchResultsSelectedCount = 0;

    @Output() resultsUpdateBravoEmitter = new EventEmitter(); // Used by Input in PerformQcBulkOperationsComponent
    @Output() resultsSelectCountUpdateBravoEmitter = new EventEmitter(); // Used by Input in PerformQcBulkOperationsComponent

    constructor( private apiService: ApiService, private utilService: UtilService,
               private querySectionService: QuerySectionService, private loginService: LoginService) { }

  ngOnInit() {
  }
    onSearchResultsUpdate( e ) {
        if( !this.utilService.isNullOrUndefinedOrEmpty( e ) ){
            this.searchResults = e;
        }
    }

    onResultsSelectCountUpdate( e ) {
        this.searchResultsSelectedCount = e;
    }


}
