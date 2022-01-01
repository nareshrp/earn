import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  pageTitle: any;
  userReportForm: FormGroup;
  role: any;
  userId: any;
  usersList:any=[];
  submitted = false;
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
    private _adminService: AdminService,
  ) { 
    this.userReportForm = this.fb.group({
      fromDate : [null, [Validators.required]],
      toDate : [null, [Validators.required]],
      status: [null, [Validators.required]],
      name: [null],
    });
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
  }

  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }

  get form() { return this.userReportForm.controls; }

  onSubmit(){

    this.spinner.show();
    this.submitted = true;
    if (this.userReportForm.invalid) {
      this.spinner.hide();
      return;
    }
    this._adminService.userReports(this.userId, this.userReportForm.value).pipe(finalize(() => {
      this.spinner.hide();
      this.submitted = false;
    })).subscribe((res: any) => {
      console.log("res", res);
      if (res.statusCode === 200) {
        this.toastr.showSuccess(res.message, 'Success');
        this.usersList=res.users;
        this.userReportForm.reset();
        
   
       
      }
    });

    
  }

}
