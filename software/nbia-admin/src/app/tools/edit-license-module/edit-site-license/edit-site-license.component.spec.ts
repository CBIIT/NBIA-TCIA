import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSiteLicenseComponent } from './edit-site-license.component';

describe('EditSiteLicenseComponent', () => {
  let component: EditSiteLicenseComponent;
  let fixture: ComponentFixture<EditSiteLicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSiteLicenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSiteLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
