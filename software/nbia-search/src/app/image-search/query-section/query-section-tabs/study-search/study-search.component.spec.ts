import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudySearchComponent } from './study-search.component';

describe('StudySearchComponent', () => {
  let component: StudySearchComponent;
  let fixture: ComponentFixture<StudySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
