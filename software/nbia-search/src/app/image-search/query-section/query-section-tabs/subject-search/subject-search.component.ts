import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nbia-subject-search',
  templateUrl: './subject-search.component.html',
  styleUrls: ['./subject-search.component.scss']
})
export class SubjectSearchComponent implements OnInit {
  subjectQueryInput = 'Test Subject search';

  constructor() { }

  ngOnInit() {
  }


    onSearchClick(){
    }

    onClearClick(){
    }
}
