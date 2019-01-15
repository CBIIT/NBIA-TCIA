import { TestBed, inject } from '@angular/core/testing';

import { ParameterService } from './parameter.service';
import { CommonService } from '@app/image-search/services/common.service';
import { ConnectionBackend, Http, HttpModule } from '@angular/http';
import { PersistenceService } from '@app/common/services/persistence.service';
import { CookieService } from 'angular2-cookie/core';
import { InitMonitorService } from '@app/common/services/init-monitor.service';

describe('ParameterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ParameterService, CommonService, ConnectionBackend, Http,
          PersistenceService, CookieService, InitMonitorService]
    });
  });

  it('should be created', inject([ParameterService], (service: ParameterService) => {
    expect(service).toBeTruthy();
  }));
});
