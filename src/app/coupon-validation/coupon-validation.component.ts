import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from '../shared/services/admin.service';
import { NotificationService } from '../shared/services/notification.service';
import { VendorService } from '../shared/services/vendor.service';

@Component({
  selector: 'app-coupon-validation',
  templateUrl: './coupon-validation.component.html',
  styleUrls: ['./coupon-validation.component.css']
})
export class CouponValidationComponent implements OnInit {
  pageTitle: any;
  couponForm: FormGroup;
  submitted = false;
  role: any;
  userId: any;
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
    private vendorService: VendorService,
  ) {
    this.couponForm = this.fb.group({
      code: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
  }

  get form() { return this.couponForm.controls; }

  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }


  onSubmit() {
    this.submitted = true;
    this.spinner.show();

    if (this.couponForm.invalid) {
      this.spinner.hide();
      return;
    }

    this.vendorService.verifyCoupon(this.userId, this.couponForm.value).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      console.log("res", res);
      this.toastr.showSuccess(res.message, 'Success');
      this.couponForm.reset();
      this.routerServices.navigate(['/deals']);
      // if (res.statusCode === 200) {

      // }
    });

  }

}
