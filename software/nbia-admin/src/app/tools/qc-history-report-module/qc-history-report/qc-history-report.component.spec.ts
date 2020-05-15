import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcHistoryReportComponent } from './qc-history-report.component';

describe('QcHistoryReportComponent', () => {
  let component: QcHistoryReportComponent;
  let fixture: ComponentFixture<QcHistoryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcHistoryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
