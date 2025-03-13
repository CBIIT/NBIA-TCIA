import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesManufacturerSearchComponent } from './images-manufacturer-search.component';

describe('ImagesManufacturerSearchComponent', () => {
  let component: ImagesManufacturerSearchComponent;
  let fixture: ComponentFixture<ImagesManufacturerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesManufacturerSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagesManufacturerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
