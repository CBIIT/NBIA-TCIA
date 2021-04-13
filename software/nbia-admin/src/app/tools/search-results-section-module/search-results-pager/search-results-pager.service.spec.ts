import { TestBed } from '@angular/core/testing';

import { SearchResultsPagerService } from './search-results-pager.service';

describe('SearchResultsPagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchResultsPagerService = TestBed.get(SearchResultsPagerService);
    expect(service).toBeTruthy();
  });
});
