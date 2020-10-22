import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcToolComponent } from './qc-tool.component';

describe('QcToolComponent', () => {
  let component: QcToolComponent;
  let fixture: ComponentFixture<QcToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
