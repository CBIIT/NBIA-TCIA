import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolTitleComponent } from './tool-title.component';

describe('ToolTitleComponent', () => {
  let component: ToolTitleComponent;
  let fixture: ComponentFixture<ToolTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
