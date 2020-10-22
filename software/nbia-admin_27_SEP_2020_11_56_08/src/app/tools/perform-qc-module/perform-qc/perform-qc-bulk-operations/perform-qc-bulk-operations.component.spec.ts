import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformQcBulkOperationsComponent } from './perform-qc-bulk-operations.component';

describe('PerformQcBulkOperationsComponent', () => {
  let component: PerformQcBulkOperationsComponent;
  let fixture: ComponentFixture<PerformQcBulkOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformQcBulkOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformQcBulkOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
