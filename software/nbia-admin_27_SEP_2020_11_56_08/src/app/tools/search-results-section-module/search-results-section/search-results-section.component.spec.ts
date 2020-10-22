import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsSectionComponent } from './search-results-section.component';

describe('SearchResultsSectionComponent', () => {
  let component: SearchResultsSectionComponent;
  let fixture: ComponentFixture<SearchResultsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
