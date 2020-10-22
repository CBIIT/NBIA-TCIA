import { TestBed } from '@angular/core/testing';

import { CineModeBravoService } from './cine-mode-bravo.service';

describe('CineModeBravoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CineModeBravoService = TestBed.get(CineModeBravoService);
    expect(service).toBeTruthy();
  });
});
