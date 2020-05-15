import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcStatusEditComponent } from './qc-status-edit.component';

describe('QcStatusEditComponent', () => {
  let component: QcStatusEditComponent;
  let fixture: ComponentFixture<QcStatusEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcStatusEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcStatusEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
