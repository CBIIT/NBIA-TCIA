import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CineModeComponent } from './cine-mode.component';

describe('CineModeComponent', () => {
  let component: CineModeComponent;
  let fixture: ComponentFixture<CineModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CineModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CineModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
