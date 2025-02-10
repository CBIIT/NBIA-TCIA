import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimumMatchedStudiesExplanationComponent } from './minimum-matched-studies-explanation.component';

describe('MinimumMatchedStudiesExplanationComponent', () => {
  let component: MinimumMatchedStudiesExplanationComponent;
  let fixture: ComponentFixture<MinimumMatchedStudiesExplanationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinimumMatchedStudiesExplanationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinimumMatchedStudiesExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
