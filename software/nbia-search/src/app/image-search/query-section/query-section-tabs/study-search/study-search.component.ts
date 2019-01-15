import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nbia-study-search',
  templateUrl: './study-search.component.html',
  styleUrls: ['./study-search.component.scss']
})
export class StudySearchComponent implements OnInit {
  studyQueryInput = 'Testing . . . 1 . . . 2 . . . 3. . . ';
  constructor() { }

  ngOnInit() {
  }
    onSearchClick(){
    }

    onClearClick(){
    }


}
