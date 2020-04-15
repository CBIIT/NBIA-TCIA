import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcHistoryReportTableComponent } from './qc-history-report-table.component';

describe('QcHistoryReportTableComponent', () => {
  let component: QcHistoryReportTableComponent;
  let fixture: ComponentFixture<QcHistoryReportTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcHistoryReportTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcHistoryReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
