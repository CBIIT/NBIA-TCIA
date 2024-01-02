import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DicomDataComponent } from './dicom-data.component';

describe('DicomDataComponent', () => {
  let component: DicomDataComponent;
  let fixture: ComponentFixture<DicomDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DicomDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DicomDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
