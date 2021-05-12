import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTimePointsExplanationComponent } from './clinical-time-points-explanation.component';

describe('ClinicalTimePointsExplinationComponent', () => {
  let component: ClinicalTimePointsExplanationComponent;
  let fixture: ComponentFixture<ClinicalTimePointsExplanationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalTimePointsExplanationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTimePointsExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
