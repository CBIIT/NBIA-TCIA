import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletionBulkOperationsComponent } from './deletion-bulk-operations.component';

describe('DeletionBulkOperationsComponent', () => {
  let component: DeletionBulkOperationsComponent;
  let fixture: ComponentFixture<DeletionBulkOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletionBulkOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletionBulkOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
