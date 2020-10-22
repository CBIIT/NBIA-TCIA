import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformQcComponent } from './perform-qc.component';

describe('PerformQcComponent', () => {
  let component: PerformQcComponent;
  let fixture: ComponentFixture<PerformQcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformQcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
