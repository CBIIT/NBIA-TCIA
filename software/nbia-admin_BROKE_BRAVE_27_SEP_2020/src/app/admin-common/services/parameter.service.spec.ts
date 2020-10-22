import { TestBed } from '@angular/core/testing';

import { ParameterService } from './parameter.service';

describe('ParameterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParameterService = TestBed.get(ParameterService);
    expect(service).toBeTruthy();
  });
});
