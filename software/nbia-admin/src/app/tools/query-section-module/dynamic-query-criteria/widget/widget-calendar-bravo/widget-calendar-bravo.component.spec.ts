import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCalendarBravoComponent } from './widget-calendar-bravo.component';

describe('WidgetCalendarBravoComponent', () => {
  let component: WidgetCalendarBravoComponent;
  let fixture: ComponentFixture<WidgetCalendarBravoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCalendarBravoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCalendarBravoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
