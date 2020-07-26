import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialUseComponent } from './commercial-use.component';

describe('CommercialUseComponent', () => {
  let component: CommercialUseComponent;
  let fixture: ComponentFixture<CommercialUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercialUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
