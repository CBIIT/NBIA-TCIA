import { TestBed } from '@angular/core/testing';

import { ReleaseDateCalendarService } from './release-date-calendar.service';

describe('ReleaseDateCalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReleaseDateCalendarService = TestBed.get(ReleaseDateCalendarService);
    expect(service).toBeTruthy();
  });
});
