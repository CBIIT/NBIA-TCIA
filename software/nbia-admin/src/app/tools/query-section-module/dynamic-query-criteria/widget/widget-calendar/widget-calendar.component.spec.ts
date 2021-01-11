import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCalendarComponent } from './widget-calendar.component';

describe('WidgetCalendarComponent', () => {
  let component: WidgetCalendarComponent;
  let fixture: ComponentFixture<WidgetCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
