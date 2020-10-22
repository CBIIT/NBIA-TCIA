import { TestBed } from '@angular/core/testing';

import { QuerySectionService } from './query-section.service';

describe('QuerySectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuerySectionService = TestBed.get(QuerySectionService);
    expect(service).toBeTruthy();
  });
});
