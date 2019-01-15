import { TestBed, inject } from '@angular/core/testing';

import { HistoryLogService } from './history-log.service';

describe('HistoryLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoryLogService]
    });
  });

  it('should be created', inject([HistoryLogService], (service: HistoryLogService) => {
    expect(service).toBeTruthy();
  }));
});
