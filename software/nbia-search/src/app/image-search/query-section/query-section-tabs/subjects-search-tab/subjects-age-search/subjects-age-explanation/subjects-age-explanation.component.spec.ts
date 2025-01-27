import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsAgeExplanationComponent } from './subjects-age-explanation.component';

describe('SubjectsAgeExplanationComponent', () => {
  let component: SubjectsAgeExplanationComponent;
  let fixture: ComponentFixture<SubjectsAgeExplanationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsAgeExplanationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectsAgeExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
