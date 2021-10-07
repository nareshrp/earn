import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from '../shared/services/admin.service';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'app-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.css']
})
export class VendorsListComponent implements OnInit {

  pageTitle: any;
  role: any;
  userId: any;
  vendorsList: any;
  errorMsg: any = '';
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private _adminServices: AdminService,

  ) { }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    this.getPendingVendorsList();
  }

  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }

  getPendingVendorsList() {
    this.spinner.show();
    this._adminServices.getVendorList(this.role).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      this.vendorsList = res.data
      console.log("vendorsList", res);
    },
      error => {
        this.errorMsg = error;
        this.toastr.showError("Error", this.errorMsg);

      }
    )
  }

}
