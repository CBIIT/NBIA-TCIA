import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CineModeBravoComponent } from './cine-mode-bravo.component';

describe('CineModeBravoComponent', () => {
  let component: CineModeBravoComponent;
  let fixture: ComponentFixture<CineModeBravoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CineModeBravoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CineModeBravoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
