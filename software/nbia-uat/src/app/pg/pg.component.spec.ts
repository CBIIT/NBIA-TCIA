import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgComponent } from './pg.component';

describe('PgComponent', () => {
  let component: PgComponent;
  let fixture: ComponentFixture<PgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
