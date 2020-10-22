import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryQcStatusComponent } from './query-qc-status.component';

describe('QcStatusComponent', () => {
  let component: QueryQcStatusComponent;
  let fixture: ComponentFixture<QueryQcStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryQcStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryQcStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
