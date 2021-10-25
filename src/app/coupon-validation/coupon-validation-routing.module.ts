import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponValidationComponent } from './coupon-validation.component';

const routes: Routes = [
  {
    path: '',
    component: CouponValidationComponent,
    data: {
      title: 'Coupon Validation',
      headerDisplay: "none"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponValidationRoutingModule { }
