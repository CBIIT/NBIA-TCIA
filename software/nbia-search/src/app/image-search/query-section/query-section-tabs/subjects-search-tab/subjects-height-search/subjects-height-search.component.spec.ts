import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsHeightSearchComponent } from './subjects-height-search.component';

describe('SubjectsHeightSearchComponent', () => {
  let component: SubjectsHeightSearchComponent;
  let fixture: ComponentFixture<SubjectsHeightSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsHeightSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectsHeightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
