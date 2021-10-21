import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.css']
})
export class CoinsComponent implements OnInit {
  pageTitle: any;
  coinsForm: FormGroup;
  role: any;
  userId: any;
  countryList: any;
  submitted = false;
  updatedCurrencyVal: any;
  upDatedCoinVal: any;
  selectedCountryId: any;
  countryCode: any;
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
    private _adminService: AdminService,
  ) {
    this.coinsForm = this.fb.group({
      name: [null, [Validators.required]],
      currency: [null],
      coinVal: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    // this.getCountryCodeData();
    this.getCountryList();

  }

  get form() { return this.coinsForm.controls; }
  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }

  getCountryList() {
    this._adminService.getCountry(this.userId).pipe(finalize(() => {

    })).subscribe((res: any) => {

      if (res.statusCode === 200) {
        this.countryList = res.result;
        console.log("country countryList", this.countryList);
      }
    })
  }

  countryChange(event: any) {
    console.log(event.target.value);
    let data = this.countryList.filter((item: any) => { return item.name == event.target.value })[0];
    this.updatedCurrencyVal = data.currency;
    this.selectedCountryId = data.id;
    this.countryCode = data.code;
    this.coinsForm.controls['currency'].setValue(this.updatedCurrencyVal);

  }

  onSubmit() {

    // console.log("form Val", this.coinsForm.value);
    this.submitted = true;
    this.spinner.show();

    if (this.coinsForm.invalid) {
      this.spinner.hide();
      return;
    }
    this.coinsForm.value['code'] = this.countryCode;

    this._adminService.upDateCoins(this.userId, this.selectedCountryId, this.coinsForm.value).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      console.log("res", res);
      if (res.statusCode === 200) {
        this.toastr.showSuccess(res.message, 'Success');
        this.coinsForm.reset();
        // this.getAllMyCities();

      }
    })

  }

}
