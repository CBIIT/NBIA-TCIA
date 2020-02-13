import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveDeletionsComponent } from './approve-deletions.component';

describe('ApproveDeletionsComponent', () => {
  let component: ApproveDeletionsComponent;
  let fixture: ComponentFixture<ApproveDeletionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveDeletionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveDeletionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
