import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-deals-list',
  templateUrl: './deals-list.component.html',
  styleUrls: ['./deals-list.component.css']
})
export class DealsListComponent implements OnInit {
  pageTitle: any;
  role:any;
  userId:any;
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
  ) { 
    
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
  createDeal(){
    this.routerServices.navigate(['/deals/create-deal']);
  }

}
