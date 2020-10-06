import { TestBed } from '@angular/core/testing';

import { DynamicQueryCriteriaService } from './dynamic-query-criteria.service';

describe('DynamicQueryCriteriaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicQueryCriteriaService = TestBed.get(DynamicQueryCriteriaService);
    expect(service).toBeTruthy();
  });
});
