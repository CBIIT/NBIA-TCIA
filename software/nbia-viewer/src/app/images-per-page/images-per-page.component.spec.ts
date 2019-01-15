import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesPerPageComponent } from './images-per-page.component';

describe('ImagesPerPageComponent', () => {
  let component: ImagesPerPageComponent;
  let fixture: ComponentFixture<ImagesPerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesPerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesPerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
