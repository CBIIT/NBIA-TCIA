import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsSearchTabComponent } from './subjects-search-tab.component';

describe('SubjectsSearchTabComponent', () => {
  let component: SubjectsSearchTabComponent;
  let fixture: ComponentFixture<SubjectsSearchTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsSearchTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectsSearchTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
