import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsWeightSearchComponent } from './subjects-weight-search.component';

describe('SubjectsWeightSearchComponent', () => {
  let component: SubjectsWeightSearchComponent;
  let fixture: ComponentFixture<SubjectsWeightSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsWeightSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectsWeightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
