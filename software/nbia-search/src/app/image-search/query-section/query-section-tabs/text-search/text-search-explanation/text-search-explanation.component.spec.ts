import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSearchExplanationComponent } from './text-search-explanation.component';

describe('TextSearchExplanationComponent', () => {
  let component: TextSearchExplanationComponent;
  let fixture: ComponentFixture<TextSearchExplanationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextSearchExplanationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSearchExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
