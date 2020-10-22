import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsSectionCharlieComponent } from './search-results-section-charlie.component';

describe('SearchResultsSectionCharlieComponent', () => {
  let component: SearchResultsSectionCharlieComponent;
  let fixture: ComponentFixture<SearchResultsSectionCharlieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultsSectionCharlieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsSectionCharlieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
