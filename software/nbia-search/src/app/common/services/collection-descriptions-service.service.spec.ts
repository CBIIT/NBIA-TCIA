import { TestBed, inject } from '@angular/core/testing';

import { CollectionDescriptionsService } from './collection-descriptions.service';

describe('CollectionDescriptionsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectionDescriptionsService]
    });
  });

  it('should be created', inject([CollectionDescriptionsService], (service: CollectionDescriptionsService) => {
    expect(service).toBeTruthy();
  }));
});
