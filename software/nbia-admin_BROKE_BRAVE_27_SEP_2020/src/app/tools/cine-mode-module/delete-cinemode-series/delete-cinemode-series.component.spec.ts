import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCinemodeSeriesComponent } from './delete-cinemode-series.component';

describe('DeleteSelectedSeriesComponent', () => {
  let component: DeleteCinemodeSeriesComponent;
  let fixture: ComponentFixture<DeleteCinemodeSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCinemodeSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCinemodeSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
