import { TestBed } from '@angular/core/testing';

import { LoadingDisplayService } from './loading-display.service';

describe('LoadingDisplayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadingDisplayService = TestBed.get(LoadingDisplayService);
    expect(service).toBeTruthy();
  });
});
