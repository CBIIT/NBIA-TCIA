import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '../../../../admin-common/services/api.service';

@Component({
  selector: 'nbia-search-results-table',
  templateUrl: './search-results-table.component.html',
  styleUrls: ['./search-results-table.component.scss']
})
export class SearchResultsTableComponent implements OnInit {

    searchResults;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService ) { }

  ngOnInit() {

      this.apiService.ApproveDeletionsSearchResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
          data => {
              this.searchResults = data;
          });

  }

    toggleSearchResultsCheckbox(){

    }

}
