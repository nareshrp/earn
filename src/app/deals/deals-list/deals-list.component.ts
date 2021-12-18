import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { VendorService } from 'src/app/shared/services/vendor.service';

@Component({
  selector: 'app-deals-list',
  templateUrl: './deals-list.component.html',
  styleUrls: ['./deals-list.component.css']
})
export class DealsListComponent implements OnInit {
  pageTitle: any;
  role: any;
  userId: any;
  errorMsg: any = '';
  dealsList: any;
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
    private vendorService: VendorService,
  ) {

  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    this.getDealsData(this.userId);
  }
  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }
  createDeal() {
    this.routerServices.navigate(['/deals/create-deal']);
  }



  getDealsData(userId: any) {
    this.spinner.show();
    this.vendorService.getDeals(userId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {

      console.log("DealsList res", res);
      this.dealsList = res.deal;
      console.log("DealsList", this.dealsList);
    },
      error => {
        this.errorMsg = error;
        this.toastr.showError("Error", this.errorMsg);

      }
    )
  }
  dealAction(action: any, dealId: any) {
    console.log(action, dealId);
    let data = {
      state: action
    }
    this.vendorService.actionDeal(this.userId, dealId, data).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {

      console.log("deal action", res);
      if (res.statusCode === 200) {

        this.getDealsData(this.userId);
        this.toastr.showSuccess(res.message, "Successfully");
      }


    },
      error => {
        this.errorMsg = error;
        this.toastr.showError("Error", this.errorMsg);

      });

  }



}
