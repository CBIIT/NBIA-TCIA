import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesSliceThicknessExplanationComponent } from './images-slice-thickness-explanation.component';

describe('ImagesSliceThicknessExplanationComponent', () => {
  let component: ImagesSliceThicknessExplanationComponent;
  let fixture: ComponentFixture<ImagesSliceThicknessExplanationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesSliceThicknessExplanationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagesSliceThicknessExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
