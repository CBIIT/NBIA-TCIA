import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSearchTabComponent } from './general-search-tab.component';

describe('GeneralSearchTabComponent', () => {
  let component: GeneralSearchTabComponent;
  let fixture: ComponentFixture<GeneralSearchTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralSearchTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneralSearchTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
