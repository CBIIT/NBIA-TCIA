import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicQueryCriteriaComponent } from './dynamic-query-criteria.component';

describe('DynamicQueryCriteriaComponent', () => {
  let component: DynamicQueryCriteriaComponent;
  let fixture: ComponentFixture<DynamicQueryCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicQueryCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicQueryCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
