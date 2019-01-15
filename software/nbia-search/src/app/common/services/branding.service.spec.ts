import { TestBed, inject } from '@angular/core/testing';

import { BrandingService } from './branding.service';

describe('BrandingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrandingService]
    });
  });

  it('should be created', inject([BrandingService], (service: BrandingService) => {
    expect(service).toBeTruthy();
  }));
});
