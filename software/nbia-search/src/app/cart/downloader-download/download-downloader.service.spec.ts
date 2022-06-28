import { TestBed } from '@angular/core/testing';

import { DownloadDownloaderService } from './download-downloader.service';

describe('DownloadDownloaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadDownloaderService = TestBed.get(DownloadDownloaderService);
    expect(service).toBeTruthy();
  });
});
