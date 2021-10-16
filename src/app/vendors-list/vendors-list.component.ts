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
  statusType:any='pending'
  statusMaste:any=[{id:1, status:'pending'}, {id:1, status:'active'}]
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
    this.getPendingVendorsList(this.statusType);
  }

  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }

  selectStatus(status:any){
    console.log(status);
    this.getPendingVendorsList(status);
  }
  getPendingVendorsList(status:any) {
    this.spinner.show();
    this._adminServices.getVendorList(this.userId, status).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      
      console.log("vendorsList", res);
      if(res.statusCode){
        this.vendorsList = res.result;
      }
    },
      error => {
        this.errorMsg = error;
        this.toastr.showError("Error", this.errorMsg);

      }
    )
  }
  approveVendor(id:any){
    let data={
      "userId":id
    }
    this.spinner.show();
      this._adminServices.pendingApproval(this.userId, data).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe((res: any) => {
        
        console.log("approveVendor", res);
        if(res.statusCode){
        this.getPendingVendorsList(this.statusType);
        this.toastr.showSuccess("Success", this.errorMsg);
        }
      
      });
  }
  
  rejectVendor(){

  }

}
