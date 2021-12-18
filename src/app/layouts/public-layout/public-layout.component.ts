import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css']
})
export class PublicLayoutComponent implements OnInit {

  couponId: any;
  dealData: any;
  coupon: any;
  constructor(
    private routerServices: Router,
    private activatedRouterServices: ActivatedRoute,
    private _adminService: AdminService,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    this.activatedRouterServices.params.subscribe((res: any) => {
      console.log("res", res.id);
      this.couponId = res.id;
      this.getCouponDetails(this.couponId);
    });

  }

  getCouponDetails(id: any) {
    this._adminService.getDealByCouponID(id).pipe(finalize(() => {
      // this.spinner.hide();
    })).subscribe((res: any) => {
      console.log("public", res);
      if (res.statusCode === 200) {
        this.dealData = res.deal;
        this.coupon = this.dealData.coupon;
      }
    });

  }


}
