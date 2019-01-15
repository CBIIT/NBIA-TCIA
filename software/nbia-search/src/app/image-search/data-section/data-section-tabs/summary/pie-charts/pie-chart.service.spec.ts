import { TestBed, inject } from '@angular/core/testing';

import { PieChartService } from './pie-chart.service';

describe('PieChartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PieChartService]
    });
  });

  it('should be created', inject([PieChartService], (service: PieChartService) => {
    expect(service).toBeTruthy();
  }));
});
