import { TestBed } from '@angular/core/testing';

import { DynamicCriteriaListService } from './dynamic-criteria-list.service';

describe('DynamicCriteriaListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicCriteriaListService = TestBed.get(DynamicCriteriaListService);
    expect(service).toBeTruthy();
  });
});
