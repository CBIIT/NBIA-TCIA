import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoLevelMultiChoiceComponent } from './two-level-multi-choice.component';

describe('TwoLevelMultiChoiceComponent', () => {
  let component: TwoLevelMultiChoiceComponent;
  let fixture: ComponentFixture<TwoLevelMultiChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoLevelMultiChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoLevelMultiChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
