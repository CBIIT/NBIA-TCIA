import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsEthnicsSearchComponent } from './subjects-ethnics-search.component';

describe('SubjectsEthnicsSearchComponent', () => {
  let component: SubjectsEthnicsSearchComponent;
  let fixture: ComponentFixture<SubjectsEthnicsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsEthnicsSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectsEthnicsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
