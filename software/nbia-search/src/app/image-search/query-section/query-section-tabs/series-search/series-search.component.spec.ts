import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SeriesSearchComponent } from './series-search.component';

describe('SeriesSearchComponent', () => {
  let component: SeriesSearchComponent;
  let fixture: ComponentFixture<SeriesSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
