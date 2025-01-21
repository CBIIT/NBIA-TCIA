import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsAgeSearchComponent } from './subjects-age-search.component';

describe('SubjectsAgeSearchComponent', () => {
  let component: SubjectsAgeSearchComponent;
  let fixture: ComponentFixture<SubjectsAgeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsAgeSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectsAgeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
