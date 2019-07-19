import { TestBed } from '@angular/core/testing';

import { OhifViewerService } from './ohif-viewer.service';

describe('OhifViewerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OhifViewerService = TestBed.get(OhifViewerService);
    expect(service).toBeTruthy();
  });
});
