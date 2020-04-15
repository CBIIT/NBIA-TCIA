import { TestBed } from '@angular/core/testing';

import { SearchResultByIndexService } from './search-result-by-index.service';

describe('SearchResultByIndexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchResultByIndexService = TestBed.get(SearchResultByIndexService);
    expect(service).toBeTruthy();
  });
});
