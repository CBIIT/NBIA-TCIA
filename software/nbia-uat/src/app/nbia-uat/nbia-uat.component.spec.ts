import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NbiaUatComponent } from './nbia-uat.component';

describe('NbiaUatComponent', () => {
  let component: NbiaUatComponent;
  let fixture: ComponentFixture<NbiaUatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NbiaUatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NbiaUatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
