import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCollectionDescriptionsComponent } from './edit-collection-descriptions.component';

describe('EditCollectionDescriptionsComponent', () => {
  let component: EditCollectionDescriptionsComponent;
  let fixture: ComponentFixture<EditCollectionDescriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCollectionDescriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCollectionDescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
