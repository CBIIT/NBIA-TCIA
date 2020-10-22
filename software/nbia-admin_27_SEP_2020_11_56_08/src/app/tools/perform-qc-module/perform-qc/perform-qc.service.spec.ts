import { TestBed } from '@angular/core/testing';

import { PerformQcService } from '../services/perform-qc.service';

describe('PerformQcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerformQcService = TestBed.get(PerformQcService);
    expect(service).toBeTruthy();
  });
});
