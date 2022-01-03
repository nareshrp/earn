import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  pageTitle: any;
  transctionReportForm: FormGroup;
  role: any;
  userId: any;
  submitted = false;
  transctionList:any=[];
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
    private _adminService: AdminService,
  ) { 
    this.transctionReportForm = this.fb.group({
      fromDate : [null, [Validators.required]],
      toDate : [null, [Validators.required]],
      status: [null, [Validators.required]],
     
    });
   }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
  }

  get form() { return this.transctionReportForm.controls; }

  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }

  onSubmit(){

    this.spinner.show();
    this.submitted = true;
    if (this.transctionReportForm.invalid) {
      this.spinner.hide();
      return;
    }
    this._adminService.transactionReports(this.userId, this.transctionReportForm.value).pipe(finalize(() => {
      this.spinner.hide();
      this.submitted = false;
    })).subscribe((res: any) => {
      console.log("res", res);
      if (res.statusCode === 200) {
        this.toastr.showSuccess(res.message, 'Success');
        this.transctionList=res.transaction;
        this.transctionReportForm.reset();
        
   
       
      }
    });

    
  }

  approve(id: any) {
    console.log(id)
    this._adminService.getApprove(this.userId, id).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      this.toastr.showSuccess(res.message, "Successfully");
    })

  }

  reject(id: any) {
    console.log(id)
    this._adminService.getRejectedCol(this.userId, id).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      this.toastr.showSuccess(res.message, "Successfully");
    })
  }
}
