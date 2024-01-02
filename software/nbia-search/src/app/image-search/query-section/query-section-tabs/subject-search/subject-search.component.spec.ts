import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectSearchComponent } from './subject-search.component';

describe('SubjectSearchComponent', () => {
  let component: SubjectSearchComponent;
  let fixture: ComponentFixture<SubjectSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
