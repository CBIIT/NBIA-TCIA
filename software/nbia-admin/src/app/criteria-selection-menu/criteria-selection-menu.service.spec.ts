import { TestBed } from '@angular/core/testing';

import { CriteriaSelectionMenuService } from './criteria-selection-menu.service';

describe('CriteriaSelectionMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CriteriaSelectionMenuService = TestBed.get(CriteriaSelectionMenuService);
    expect(service).toBeTruthy();
  });
});
