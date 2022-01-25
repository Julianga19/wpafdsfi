import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteriesComponent } from './loteries.component';

describe('LoteriesComponent', () => {
  let component: LoteriesComponent;
  let fixture: ComponentFixture<LoteriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoteriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoteriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
