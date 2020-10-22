import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiChoiceListComponent } from './multi-choice-list.component';

describe('MultiChoiceListComponent', () => {
  let component: MultiChoiceListComponent;
  let fixture: ComponentFixture<MultiChoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiChoiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiChoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
