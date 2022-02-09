import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseDateCalendarComponent } from './release-date-calendar.component';

describe('ReleaseDateCalendarComponent', () => {
  let component: ReleaseDateCalendarComponent;
  let fixture: ComponentFixture<ReleaseDateCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseDateCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseDateCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
