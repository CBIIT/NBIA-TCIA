import { TestBed } from '@angular/core/testing';

import { WidgetSiteLicenseService } from './widget-site-license.service';

describe('WidgetSiteLicenseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetSiteLicenseService = TestBed.get(WidgetSiteLicenseService);
    expect(service).toBeTruthy();
  });
});
