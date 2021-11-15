import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTypedByUserComponent } from './chart-typed-by-user.component';

describe('ChartTypedByUserComponent', () => {
  let component: ChartTypedByUserComponent;
  let fixture: ComponentFixture<ChartTypedByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartTypedByUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTypedByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
