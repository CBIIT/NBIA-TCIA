import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NbiaAdminClientComponent } from './nbia-admin-client.component';

describe('NbiaAdminClientComponent', () => {
  let component: NbiaAdminClientComponent;
  let fixture: ComponentFixture<NbiaAdminClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NbiaAdminClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NbiaAdminClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
