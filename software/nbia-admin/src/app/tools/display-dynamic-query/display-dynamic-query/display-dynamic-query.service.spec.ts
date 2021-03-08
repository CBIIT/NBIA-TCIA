import { TestBed } from '@angular/core/testing';

import { DisplayDynamicQueryService } from './display-dynamic-query.service';

describe('DisplayDynamicQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisplayDynamicQueryService = TestBed.get(DisplayDynamicQueryService);
    expect(service).toBeTruthy();
  });
});
