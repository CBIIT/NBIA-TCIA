import { TestBed } from '@angular/core/testing';

import { WidgetCalendarService } from './widget-calendar.service';

describe('WidgetCalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetCalendarService = TestBed.get(WidgetCalendarService);
    expect(service).toBeTruthy();
  });
});
