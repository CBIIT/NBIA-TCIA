import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingCriteriaComponent } from './missing-criteria.component';

describe('MissingCriteriaComponent', () => {
  let component: MissingCriteriaComponent;
  let fixture: ComponentFixture<MissingCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
