import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionProgramQueryExplanationComponent } from './collection-program-query-explanation.component';

describe('CollectionProgramQueryExplanationComponent', () => {
  let component: CollectionProgramQueryExplanationComponent;
  let fixture: ComponentFixture<CollectionProgramQueryExplanationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionProgramQueryExplanationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectionProgramQueryExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
