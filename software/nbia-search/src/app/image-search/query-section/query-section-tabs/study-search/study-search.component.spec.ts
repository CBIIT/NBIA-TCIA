import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudySearchComponent } from './study-search.component';

describe('StudySearchComponent', () => {
  let component: StudySearchComponent;
  let fixture: ComponentFixture<StudySearchComponent>;

  beforeEach(waitForAsync(() => {
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
