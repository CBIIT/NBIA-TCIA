import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QueryUrlComponent } from './query-url.component';
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Location } from '@angular/common';
import { CommonService } from '@app/image-search/services/common.service';
import { HttpBackend, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PersistenceService } from '@app/common/services/persistence.service';
import { CookieService } from 'ngx-cookie-service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ClipboardModule } from '@angular/cdk/clipboard';

describe('QueryUrlComponent', () => {
  let component: QueryUrlComponent;
  let fixture: ComponentFixture<QueryUrlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryUrlComponent ],
        imports: [ HttpClientModule, ClipboardModule],
        providers: [  {provide: APP_BASE_HREF, useValue : '.' },
        CommonService, HttpClient, HttpBackend, PersistenceService, CookieService, QueryUrlService,
        Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
