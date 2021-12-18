import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from '../shared/services/admin.service';
import { NotificationService } from '../shared/services/notification.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  pageTitle: any;
  role: any;
  userId: any;
  usersList: any = [];
  isWithdrawal: boolean = false;
  updatedRowId: any;
  filterDataList: any;
  updatedIndex: any;
  userQAList: any = [];
  bankAccount: any;
  selectedUserId: any;
  filterUserData: any = [];
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private _adminServices: AdminService,
    private modalService: NgbModal
  ) {
    this.slectedUser(this.usersList[0], 0);
    // this.userSearch(this.selectedUserId);
    this.selectedUserId = '';
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    this.getUsersData();
    // this.slectedUser(this.usersList[0],0);

  }

  openLg(content: any, data: any) {
    this.modalService.open(content, { size: 'lg' });
    console.log("data", data);
    this.bankAccount = data;
  }



  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }

  getUsersData() {
    this.spinner.show();
    this._adminServices.getAllUsers(this.userId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {

      if (res.statusCode == 200) {
        this.usersList = res.users;
        console.log("Users List", this.usersList);
        console.log(this.usersList[0]);
        this.slectedUser(this.usersList[0], 0);
        this.userSearch(this.selectedUserId)
      }
    });
  }


  slectedUser(row: any, index: any) {
    console.log("row", row);
    //  this.updatedRowId=row.userId;
    this.updatedIndex = index;
    this.filterDataList = this.usersList.filter((item: any) => { return item.userId == row.userId })[0];
    console.log("filter Data", this.filterDataList);
    // this.getWithdrawScreenMsg();

  }

  userSearch(selectedUser: any) {

    this.selectedUserId = selectedUser;
    console.log("selectedUser", this.selectedUserId);
    if (selectedUser !== '' && selectedUser !== null) {
      this.filterUserData = this.usersList.filter((item: any) => { return item.userId == selectedUser });
      console.log("filterUserData", this.filterUserData);
      this.slectedUser(this.filterUserData[0], 0);
    }
    else {
      this.filterUserData = this.usersList;
      this.slectedUser(this.usersList[0], 0);
    }


  }



  // getWithdrawScreenMsg(){
  //   let id="619656823d4bd2ce01ea2ee6"
  //   this._adminServices.getWithdrawScreenMsg(id).pipe(finalize(() => {

  //   })).subscribe((res: any) => {
  //     console.log(res);
  //   });
  // }

  showQuestions(content: any) {

    this._adminServices.getUserQstnAnswer(this.userId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      console.log("res", res);
      this.modalService.open(content, { size: 'lg' });
      if (res.statusCode === 200) {
        this.userQAList = res.qstnAnswere;
        console.log("userQAList", this.userQAList)
      }

    });


  }

  approve(id: any) {
    console.log(id)
    this._adminServices.getApprove(this.userId, id).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      this.toastr.showSuccess(res.message, "Successfully");
    })

  }

  reject(id: any) {
    console.log(id)
    this._adminServices.getRejectedCol(this.userId, id).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      this.toastr.showSuccess(res.message, "Successfully");
    })
  }




}
