import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponValidationComponent } from './coupon-validation.component';

describe('CouponValidationComponent', () => {
  let component: CouponValidationComponent;
  let fixture: ComponentFixture<CouponValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
