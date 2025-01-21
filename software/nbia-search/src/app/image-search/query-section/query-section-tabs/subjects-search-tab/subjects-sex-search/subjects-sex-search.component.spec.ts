import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsSexSearchComponent } from './subjects-sex-search.component';

describe('SubjectsSexSearchComponent', () => {
  let component: SubjectsSexSearchComponent;
  let fixture: ComponentFixture<SubjectsSexSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsSexSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectsSexSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
