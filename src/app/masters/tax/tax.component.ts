import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css']
})
export class TaxComponent implements OnInit {
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
  countryCoinsData: any;
  isRowEdit: boolean = false;
  rowId: any;
  updatedCode: any;
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
      // currency: [null],
      // coinVal: [null, [Validators.required]],
      taxType: [null, [Validators.required]],
      vat: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    // this.getCountryCodeData();
    this.getCountryList();
    this.getCountryListWithCoinsData();

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

  getCountryListWithCoinsData() {
    this._adminService.getTax(this.userId).pipe(finalize(() => {

    })).subscribe((res: any) => {

      if (res.statusCode === 200) {
        this.countryCoinsData = res.result;
        console.log("country countryCoinsData", this.countryCoinsData);
      }
    })
  }

  countryChange(event: any) {
    console.log(event.target.value);
    let data = this.countryList.filter((item: any) => { return item.name == event.target.value })[0];
    this.updatedCurrencyVal = data.currency;
    this.selectedCountryId = data.id;
    this.countryCode = data.code;
    console.log(this.countryCode);
    // this.coinsForm.controls['currency'].setValue(this.updatedCurrencyVal);

  }
  editRow(row: any) {
    this.isRowEdit = true;
    console.log("row id", row.id);
    console.log("row", row);
    this.rowId = row.id;
    // this.countryForm.controls['code'].setValue(row.code);
    // this.updatedCode = this.countryCoinsData.filter((item: any) => {
    //   return item.name === row.name;
    // })[0].code;

    this.coinsForm.controls['name'].setValue(row.name);
    // this.coinsForm.controls['currency'].setValue(row.currency);
    // this.coinsForm.controls['coinVal'].setValue(row.coinVal);
    this.coinsForm.controls['taxType'].setValue(row.tax);
    this.coinsForm.controls['vat'].setValue(row.vat);
    // this.selectCountry(row.name);
    console.log("rowupdated form value", this.coinsForm.value);



  }
  updateRow() {
    this.isRowEdit = false;
    // let data = {
    //   "name": this.coinsForm.value['name'],
    //   "code": this.updatedCode,
    //   "currency": this.coinsForm.value['currency'],
    // }
    console.log("set data", this.coinsForm.value);
    this._adminService.editTax(this.userId, this.rowId, this.coinsForm.value).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.toastr.showSuccess(result.message, 'Success');
        this.coinsForm.reset();
        this.getCountryListWithCoinsData();

      }
    });
  }
  rowDelete(id: any) {
    console.log("delete", id);

    this._adminService.deleteTax(this.userId, id).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.toastr.showSuccess(result.message, 'Success');
        this.getCountryListWithCoinsData();
      }
    });
  }

  onSubmit() {

    // console.log("form Val", this.coinsForm.value);
    this.submitted = true;
    this.spinner.show();

    if (this.coinsForm.invalid) {
      this.spinner.hide();
      return;
    }

    let uniqueval = this.countryCoinsData.filter((itm: any, i: any, a: any) => {
      // array of unique elements
      console.log("itm", itm);
      return this.coinsForm.value.name == itm.name;
    });

    if (uniqueval.length) {
      this.toastr.showError("Dublicate Entry", 'Error');
      this.spinner.hide();
      this.coinsForm.reset();

    } else {
      this.coinsForm.value['code'] = this.countryCode;
      this._adminService.addTax(this.userId, this.coinsForm.value).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe((res: any) => {
        console.log("res", res);
        if (res.statusCode === 200) {
          this.toastr.showSuccess(res.message, 'Success');
          this.getCountryListWithCoinsData();
          this.coinsForm.reset();
          // this.getAllMyCities();

        }
      });
    }

  }

}
