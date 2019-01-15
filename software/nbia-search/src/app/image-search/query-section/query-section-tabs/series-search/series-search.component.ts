import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nbia-series-search',
  templateUrl: './series-search.component.html',
  styleUrls: ['./series-search.component.scss']
})
export class SeriesSearchComponent implements OnInit {
  seriesQueryInput = 'Test Series search';

  constructor() { }

  ngOnInit() {
  }
    onSearchClick(){
    }

    onClearClick(){
    }


}
