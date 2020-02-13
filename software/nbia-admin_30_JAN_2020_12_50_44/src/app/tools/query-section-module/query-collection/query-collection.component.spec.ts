import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryCollectionComponent } from './query-collection.component';

describe('QcCollectionComponent', () => {
  let component: QueryCollectionComponent;
  let fixture: ComponentFixture<QueryCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
