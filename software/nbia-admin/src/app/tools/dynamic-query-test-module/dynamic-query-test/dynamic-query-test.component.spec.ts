import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicQueryTestComponent } from './dynamic-query-test.component';

describe('DynamicQueryTestComponent', () => {
  let component: DynamicQueryTestComponent;
  let fixture: ComponentFixture<DynamicQueryTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicQueryTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicQueryTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
