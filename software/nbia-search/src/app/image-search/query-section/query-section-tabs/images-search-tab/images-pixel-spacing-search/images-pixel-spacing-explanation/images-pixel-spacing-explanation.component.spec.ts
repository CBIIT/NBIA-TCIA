import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesPixelSpacingExplanationComponent } from './images-pixel-spacing-explanation.component';

describe('ImagesPixelSpacingExplanationComponent', () => {
  let component: ImagesPixelSpacingExplanationComponent;
  let fixture: ComponentFixture<ImagesPixelSpacingExplanationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesPixelSpacingExplanationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagesPixelSpacingExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
