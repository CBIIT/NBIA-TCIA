import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChoiceListComponent } from './single-choice-list.component';

describe('SingleChoiceListComponent', () => {
  let component: SingleChoiceListComponent;
  let fixture: ComponentFixture<SingleChoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleChoiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleChoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
