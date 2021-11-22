import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
  }

  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }


}
