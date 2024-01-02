import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DaysFromBaselineComponent } from './days-from-baseline.component';

describe('DaysFromBaselineComponent', () => {
  let component: DaysFromBaselineComponent;
  let fixture: ComponentFixture<DaysFromBaselineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DaysFromBaselineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysFromBaselineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
