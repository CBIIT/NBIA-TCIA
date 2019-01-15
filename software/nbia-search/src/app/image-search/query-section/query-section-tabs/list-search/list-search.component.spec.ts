import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSearchComponent } from './list-search.component';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

describe('ListSearchComponent', () => {
  let component: ListSearchComponent;
  let fixture: ComponentFixture<ListSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSearchComponent ],
        imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
