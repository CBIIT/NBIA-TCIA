import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkflowItemsComponent } from './manage-workflow-items.component';

describe('ManageWorkflowItemsComponent', () => {
  let component: ManageWorkflowItemsComponent;
  let fixture: ComponentFixture<ManageWorkflowItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageWorkflowItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWorkflowItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
