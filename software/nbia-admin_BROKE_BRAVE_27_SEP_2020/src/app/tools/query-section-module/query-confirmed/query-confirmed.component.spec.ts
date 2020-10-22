import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryConfirmedComponent } from './query-confirmed.component';

describe('QcConfirmedComponent', () => {
  let component: QueryConfirmedComponent;
  let fixture: ComponentFixture<QueryConfirmedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryConfirmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
