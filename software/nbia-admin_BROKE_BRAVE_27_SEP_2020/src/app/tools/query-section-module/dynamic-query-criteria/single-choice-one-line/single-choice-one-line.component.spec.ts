import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChoiceOneLineComponent } from './single-choice-one-line.component';

describe('SingleChoiceOneLineComponent', () => {
  let component: SingleChoiceOneLineComponent;
  let fixture: ComponentFixture<SingleChoiceOneLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleChoiceOneLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleChoiceOneLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
