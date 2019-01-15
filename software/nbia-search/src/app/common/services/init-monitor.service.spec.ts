import { TestBed, inject } from '@angular/core/testing';

import { InitMonitorService } from './init-monitor.service';

describe('InitMonitorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitMonitorService]
    });
  });

  it('should be created', inject([InitMonitorService], (service: InitMonitorService) => {
    expect(service).toBeTruthy();
  }));
});
