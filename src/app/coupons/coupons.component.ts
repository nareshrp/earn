import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from '../shared/services/admin.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {

  couponId: any;
  dealData: any;
  coupon: any;
  ipAddress:any;
  constructor(
    private routerServices: Router,
    private activatedRouterServices: ActivatedRoute,
    private _adminService: AdminService,
    private spinner: NgxSpinnerService,

  ) { 
    // this.getIP();
  }

  ngOnInit(): void {
    this.activatedRouterServices.params.subscribe((res: any) => {
      console.log("res", res.id);
      this.couponId = res.id;
      this.getCouponDetails(this.couponId);
    });
    
  }

  getCouponDetails(id: any) {
    this._adminService.getDealByCouponViews(id).pipe(finalize(() => {
      // this.spinner.hide();
     this.getIP();
        
    })).subscribe((res: any) => {
      console.log("public", res);
      if (res.statusCode === 200) {
        this.dealData = res.deal;
        this.coupon = this.dealData.coupon;
        
      }
    });

 

  }

getIP()  
  {  
this._adminService.getIPAddress().subscribe((res:any)=>{  
      this.ipAddress=res.ip;  
      console.log("this.ipAddress", this.ipAddress);
    
        this._adminService.countIp(this.couponId, {"IP":this.ipAddress}).subscribe((result:any)=>{
           console.log("result", result);
         })
    });  
  } 

}
