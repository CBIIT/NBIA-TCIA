import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesPerPageComponent } from './images-per-page.component';

describe('ImagesPerPageComponent', () => {
  let component: ImagesPerPageComponent;
  let fixture: ComponentFixture<ImagesPerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagesPerPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagesPerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
