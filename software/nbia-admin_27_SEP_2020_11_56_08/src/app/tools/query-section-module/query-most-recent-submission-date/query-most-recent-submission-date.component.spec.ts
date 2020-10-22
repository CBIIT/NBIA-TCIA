import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryMostRecentSubmissionDateComponent } from './query-most-recent-submission-date.component';

describe('QcMostRecentSubmissionDateComponent', () => {
  let component: QueryMostRecentSubmissionDateComponent;
  let fixture: ComponentFixture<QueryMostRecentSubmissionDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryMostRecentSubmissionDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryMostRecentSubmissionDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
