import { TestBed } from '@angular/core/testing';

import { CineModeService } from './cine-mode.service';

describe('CineModeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CineModeService = TestBed.get(CineModeService);
    expect(service).toBeTruthy();
  });
});
