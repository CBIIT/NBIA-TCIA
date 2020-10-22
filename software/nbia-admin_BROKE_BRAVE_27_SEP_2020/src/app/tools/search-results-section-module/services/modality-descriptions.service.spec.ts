import { TestBed } from '@angular/core/testing';

import { ModalityDescriptionsService } from './modality-descriptions.service';

describe('ModalityDescriptionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModalityDescriptionsService = TestBed.get(ModalityDescriptionsService);
    expect(service).toBeTruthy();
  });
});
