import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcSeriesReportTableComponent } from './qc-series-report-table.component';

describe('QcSeriesReportTableComponent', () => {
  let component: QcSeriesReportTableComponent;
  let fixture: ComponentFixture<QcSeriesReportTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcSeriesReportTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcSeriesReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
