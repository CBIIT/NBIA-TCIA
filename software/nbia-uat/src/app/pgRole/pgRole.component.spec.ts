import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgRoleComponent } from './pg-role.component';

describe('PgRoleComponent', () => {
  let component: PgRoleComponent;
  let fixture: ComponentFixture<PgRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
