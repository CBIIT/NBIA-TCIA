import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubmissionReportsComponent } from './view-submission-reports.component';

describe('ViewSubmissionReportsComponent', () => {
  let component: ViewSubmissionReportsComponent;
  let fixture: ComponentFixture<ViewSubmissionReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSubmissionReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubmissionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
