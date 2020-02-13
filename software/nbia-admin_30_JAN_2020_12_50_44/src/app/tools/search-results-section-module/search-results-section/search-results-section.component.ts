import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../admin-common/services/api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'nbia-search-results-section',
  templateUrl: './search-results-section.component.html',
  styleUrls: ['./search-results-section.component.scss']
})
export class SearchResultsSectionComponent implements OnInit {



    constructor( ) { }

  ngOnInit() {
  }

}
