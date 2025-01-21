import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesSearchTabComponent } from './images-search-tab.component';

describe('ImagesSearchTabComponent', () => {
  let component: ImagesSearchTabComponent;
  let fixture: ComponentFixture<ImagesSearchTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesSearchTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagesSearchTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
