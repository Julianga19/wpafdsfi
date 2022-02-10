import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByVendorComponent } from './sales-by-vendor.component';

describe('SalesByVendorComponent', () => {
  let component: SalesByVendorComponent;
  let fixture: ComponentFixture<SalesByVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesByVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesByVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
