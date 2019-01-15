import { TestBed, inject } from '@angular/core/testing';

import { ModalityDescriptionsService } from './modality-descriptions.service';

describe('ModalityDescriptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalityDescriptionsService]
    });
  });

  it('should be created', inject([ModalityDescriptionsService], (service: ModalityDescriptionsService) => {
    expect(service).toBeTruthy();
  }));
});
