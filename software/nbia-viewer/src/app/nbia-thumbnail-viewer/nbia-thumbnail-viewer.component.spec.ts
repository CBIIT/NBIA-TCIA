import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbiaThumbnailViewerComponent } from './nbia-thumbnail-viewer.component';

describe('NbiaThumbnailViewerComponent', () => {
  let component: NbiaThumbnailViewerComponent;
  let fixture: ComponentFixture<NbiaThumbnailViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NbiaThumbnailViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NbiaThumbnailViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
