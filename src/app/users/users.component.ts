import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from '../shared/services/admin.service';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  pageTitle: any;
  role: any;
  userId: any;
  usersList:any=[];
  isWithdrawal:boolean=false;
  updatedRowId:any;
  filterDataList:any;
  updatedIndex:any;
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private _adminServices: AdminService,
  ) { 
    this.slectedUser(this.usersList[0],0);
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    this.getUsersData();
    // this.slectedUser(this.usersList[0],0);
  
  }

  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }

  getUsersData(){
    this.spinner.show();
      this._adminServices.getAllUsers(this.userId).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe((res: any) => {
        
        if(res.statusCode==200){
          this.usersList=res.users;
          console.log("Users List", this.usersList);
          console.log(this.usersList[0]);
          this.slectedUser(this.usersList[0],0);
        }
      });
  }

  slectedUser(row:any, index:any){
    // console.log("row", row);
    // this.updatedRowId=row.userId;
    this.updatedIndex=index;
    this.filterDataList= this.usersList.filter((item:any)=>{ return item.userId==row.userId})[0];
    console.log("filter Data", this.filterDataList);

  }

  showQuestions(){
   
   this._adminServices.getUserQstnAnswer(this.userId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      console.log("res", res);
    });

    
  }


}
