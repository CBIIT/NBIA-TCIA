import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayQueryComponent } from './display-query.component';

describe('DisplayQueryComponent', () => {
  let component: DisplayQueryComponent;
  let fixture: ComponentFixture<DisplayQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
