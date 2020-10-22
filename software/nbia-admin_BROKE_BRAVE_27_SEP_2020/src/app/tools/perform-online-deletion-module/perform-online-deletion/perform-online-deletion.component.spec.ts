import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformOnlineDeletionComponent } from './perform-online-deletion.component';

describe('PerformOnlineDeletionComponent', () => {
  let component: PerformOnlineDeletionComponent;
  let fixture: ComponentFixture<PerformOnlineDeletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformOnlineDeletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformOnlineDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
