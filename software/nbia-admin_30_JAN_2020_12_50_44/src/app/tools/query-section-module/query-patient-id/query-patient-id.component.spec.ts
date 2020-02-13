import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryPatientIdComponent } from './query-patient-id.component';

describe('QcPatientIdComponent', () => {
  let component: QueryPatientIdComponent;
  let fixture: ComponentFixture<QueryPatientIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryPatientIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryPatientIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
