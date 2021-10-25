import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponValidationRoutingModule } from './coupon-validation-routing.module';
import { CouponValidationComponent } from './coupon-validation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    CouponValidationComponent
  ],
  imports: [
    CommonModule,
    CouponValidationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ]
})
export class CouponValidationModule { }
