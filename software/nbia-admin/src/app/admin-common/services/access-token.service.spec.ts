import { TestBed } from '@angular/core/testing';

import { AccessTokenService } from './access-token.service';

describe('AccessTokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccessTokenService = TestBed.get(AccessTokenService);
    expect(service).toBeTruthy();
  });
});
