import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { PagerComponent } from '../pager/pager.component';
import { ImagesPerPageComponent } from '../images-per-page/images-per-page.component';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'angular2-cookie/core';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterComponent, PagerComponent, ImagesPerPageComponent ],
        imports: [FormsModule ],
        providers: [CookieService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
