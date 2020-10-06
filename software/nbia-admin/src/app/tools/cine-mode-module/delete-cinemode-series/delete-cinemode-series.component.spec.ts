import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCinemodeSeriesComponent } from './delete-cinemode-series.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DeleteSelectedSeriesComponent', () => {
  let component: DeleteCinemodeSeriesComponent;
  let fixture: ComponentFixture<DeleteCinemodeSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            HttpClientModule,
            FormsModule,
        ],
      declarations: [ DeleteCinemodeSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCinemodeSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
