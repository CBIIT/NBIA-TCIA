import { TestBed, inject } from '@angular/core/testing';

import { LoadingDisplayService } from './loading-display.service';

describe('LoadingDisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingDisplayService]
    });
  });

  it('should be created', inject([LoadingDisplayService], (service: LoadingDisplayService) => {
    expect(service).toBeTruthy();
  }));
});
