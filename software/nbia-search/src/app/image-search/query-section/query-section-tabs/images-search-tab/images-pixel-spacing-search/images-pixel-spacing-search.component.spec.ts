import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesPixelSpacingSearchComponent } from './images-pixel-spacing-search.component';

describe('ImagesPixelSpacingSearchComponent', () => {
  let component: ImagesPixelSpacingSearchComponent;
  let fixture: ComponentFixture<ImagesPixelSpacingSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesPixelSpacingSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagesPixelSpacingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
