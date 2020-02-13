import { TestBed } from '@angular/core/testing';

import { DisplayQueryService } from './display-query.service';

describe('DisplayQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisplayQueryService = TestBed.get(DisplayQueryService);
    expect(service).toBeTruthy();
  });
});
