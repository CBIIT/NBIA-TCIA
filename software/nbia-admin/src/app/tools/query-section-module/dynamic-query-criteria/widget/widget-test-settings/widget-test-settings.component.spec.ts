import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetTestSettingsComponent } from './widget-test-settings.component';

describe('WidgetTestSettingsComponent', () => {
  let component: WidgetTestSettingsComponent;
  let fixture: ComponentFixture<WidgetTestSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetTestSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetTestSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
