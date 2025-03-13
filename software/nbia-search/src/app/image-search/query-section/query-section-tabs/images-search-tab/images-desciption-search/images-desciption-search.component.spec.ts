import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesDesciptionSearchComponent } from './images-desciption-search.component';

describe('ImagesDesciptionSearchComponent', () => {
  let component: ImagesDesciptionSearchComponent;
  let fixture: ComponentFixture<ImagesDesciptionSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesDesciptionSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagesDesciptionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
