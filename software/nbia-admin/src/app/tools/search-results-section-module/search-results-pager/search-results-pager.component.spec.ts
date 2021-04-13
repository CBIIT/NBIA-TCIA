import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsPagerComponent } from './search-results-pager.component';

describe('SearchResultsPagerComponent', () => {
  let component: SearchResultsPagerComponent;
  let fixture: ComponentFixture<SearchResultsPagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultsPagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
