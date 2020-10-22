import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryReleasedComponent } from './query-released.component';

describe('QcReleasedComponent', () => {
  let component: QueryReleasedComponent;
  let fixture: ComponentFixture<QueryReleasedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryReleasedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryReleasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
