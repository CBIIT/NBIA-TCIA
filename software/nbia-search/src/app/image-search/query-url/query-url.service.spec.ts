import { TestBed, inject } from '@angular/core/testing';

import { QueryUrlService } from './query-url.service';

describe('QueryUrlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryUrlService]
    });
  });

  it('should be created', inject([QueryUrlService], (service: QueryUrlService) => {
    expect(service).toBeTruthy();
  }));
});
