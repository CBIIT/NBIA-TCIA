import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesSliceThicknessSearchComponent } from './images-slice-thickness-search.component';

describe('ImagesSliceThicknessSearchComponent', () => {
  let component: ImagesSliceThicknessSearchComponent;
  let fixture: ComponentFixture<ImagesSliceThicknessSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesSliceThicknessSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagesSliceThicknessSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
