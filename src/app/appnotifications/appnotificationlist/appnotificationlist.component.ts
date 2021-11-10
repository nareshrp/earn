import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-appnotificationlist',
  templateUrl: './appnotificationlist.component.html',
  styleUrls: ['./appnotificationlist.component.css']
})
export class AppnotificationlistComponent implements OnInit {
  notificationForm: FormGroup;
  pageTitle="App Notification";
  submitted = false;
  role: any;
  userId: any;
messageLiest:any;
isUpdateBt:boolean=false;
isSaveBt:boolean=true;
updateRowId:any;
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
    public adminService: AdminService,
    private datePipe: DatePipe,

  ) { 
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");

    this.notificationForm = this.fb.group({
      title: [null, [Validators.required]],
      message: [null, [Validators.required]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getNotificationMessage();
  }

  get form() { return this.notificationForm.controls; }
  getNotificationMessage(){
    this.adminService.getNotification(this.userId).subscribe((result:any)=>{
      console.log("res", result);
      if(result.statusCode===200){
      this.messageLiest=result.result;
      }
    })
  }

  editRow(row: any) {
    console.log("row",row);
    this.isUpdateBt=true;
  this.isSaveBt=false;
  this.updateRowId = row.id;
  this.notificationForm.controls['title'].setValue(row.title);
  this.notificationForm.controls['message'].setValue(row.message);
  this.notificationForm.controls['fromDate'].setValue(this.datePipe.transform(row.fromDate, 'yyyy-MM-ddThh:mm:ss.SSS'));
  this.notificationForm.controls['toDate'].setValue( this.datePipe.transform(row.toDate, 'yyyy-MM-ddThh:mm:ss.SSS'));
    
  }

  updateRow(){
    this.isUpdateBt=false;
    this.isSaveBt=true;

    this.adminService.updateNotification(this.userId,this.updateRowId,this.notificationForm.value).subscribe((result:any)=>{
      if(result.statusCode===200){
        this.toastr.showSuccess(result.message, 'Success');
        this.getNotificationMessage();
        this.notificationForm.reset();
      }  
    });

  }
  rowDelete(rowId:any){
      this.adminService.deleteNotification(this.userId, rowId).subscribe((res:any)=>{
   
      if(res.statusCode===200){
        this.toastr.showSuccess(res.message, "Successfully");
        this.getNotificationMessage()
      }
     
      
    })
  }

  onSubmit() {
    this.submitted = true;
   

    if (this.notificationForm.invalid) {
      this.spinner.hide();
      return;
    }
    this.spinner.show();
  

    this.adminService.addNotification(this.userId, this.notificationForm.value).pipe(finalize(() => {
      this.spinner.hide();

    })).subscribe((res: any) => {
       
        if(res.statusCode===200){
          this.toastr.showSuccess(res.message, "Successfully");
          this.getNotificationMessage()
          this.notificationForm.reset();
        }

       
    });

  }

}
