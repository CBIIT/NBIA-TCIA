import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertBoxComponent } from './alert-box.component';

describe('AlertBoxComponent', () => {
  let component: AlertBoxComponent;
  let fixture: ComponentFixture<AlertBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
