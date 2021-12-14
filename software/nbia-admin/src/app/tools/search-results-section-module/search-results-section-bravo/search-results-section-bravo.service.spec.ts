import { TestBed } from '@angular/core/testing';

import { SearchResultsSectionBravoService } from './search-results-section-bravo.service';

describe('SearchResultsSectionBravoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchResultsSectionBravoService = TestBed.get(SearchResultsSectionBravoService);
    expect(service).toBeTruthy();
  });
});
