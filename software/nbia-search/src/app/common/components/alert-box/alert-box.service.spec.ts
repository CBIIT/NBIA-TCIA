import { TestBed, inject } from '@angular/core/testing';

import { AlertBoxService } from './alert-box.service';

describe('AlertBoxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertBoxService]
    });
  });

  it('should be created', inject([AlertBoxService], (service: AlertBoxService) => {
    expect(service).toBeTruthy();
  }));
});
