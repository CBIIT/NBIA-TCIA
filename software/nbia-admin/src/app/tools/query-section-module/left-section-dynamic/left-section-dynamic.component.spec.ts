import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSectionDynamicComponent } from './left-section-dynamic.component';

describe('LeftSectionDynamicComponent', () => {
  let component: LeftSectionDynamicComponent;
  let fixture: ComponentFixture<LeftSectionDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftSectionDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSectionDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
