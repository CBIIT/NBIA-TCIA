import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallTextInputComponent } from './small-text-input.component';

describe('SmallTextInputComponent', () => {
  let component: SmallTextInputComponent;
  let fixture: ComponentFixture<SmallTextInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallTextInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
