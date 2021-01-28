import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaSelectionMenuComponent } from './criteria-selection-menu.component';

describe('CriteriaSelectionMenuComponent', () => {
  let component: CriteriaSelectionMenuComponent;
  let fixture: ComponentFixture<CriteriaSelectionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriteriaSelectionMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaSelectionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
