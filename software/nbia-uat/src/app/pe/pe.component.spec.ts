import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeComponent } from './pe.component';

describe('PeComponent', () => {
  let component: PeComponent;
  let fixture: ComponentFixture<PeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
