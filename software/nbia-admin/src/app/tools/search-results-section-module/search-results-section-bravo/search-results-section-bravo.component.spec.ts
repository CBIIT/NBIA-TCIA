import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsSectionBravoComponent } from './search-results-section-bravo.component';

describe('SearchResultsSectionBravoComponent', () => {
  let component: SearchResultsSectionBravoComponent;
  let fixture: ComponentFixture<SearchResultsSectionBravoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultsSectionBravoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsSectionBravoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
