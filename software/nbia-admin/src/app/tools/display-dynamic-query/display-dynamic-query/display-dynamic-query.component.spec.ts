import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayDynamicQueryComponent } from './display-dynamic-query.component';

describe('DisplayDynamicQueryComponent', () => {
  let component: DisplayDynamicQueryComponent;
  let fixture: ComponentFixture<DisplayDynamicQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayDynamicQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDynamicQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
