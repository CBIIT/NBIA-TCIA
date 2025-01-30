import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesDescriptionExplanationComponent } from './images-description-explanation.component';

describe('ImagesDescriptionExplanationComponent', () => {
  let component: ImagesDescriptionExplanationComponent;
  let fixture: ComponentFixture<ImagesDescriptionExplanationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesDescriptionExplanationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagesDescriptionExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
