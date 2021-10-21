import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  pageTitle: any;
  countryForm: FormGroup;
  submitted = false;
  errorMsg = '';
  countryCodes: any;
  countryCaodeValue: any;
  role: any;
  userId: any;
  countryList: any;
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
    this.countryForm = this.fb.group({
      name: [null, [Validators.required]],
      code: [null],
      currency: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    this.getCountryCodeData();
    this.getCountryList();
  }

  get form() { return this.countryForm.controls; }
  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }

  getCountryCodeData() {
    this._adminService.getCountryCode().subscribe((result: any) => {

      if (result.statusCode === 200) {
        this.countryCodes = result.result;
        console.log("country codes", this.countryCodes);
      }
    });
  }

  selectCountry(value: any) {
    console.log(value);
    // let slp = value.split("|");
    // console.log(slp[0]);
    this.countryCaodeValue = this.countryCodes.filter((item: any) => {
      return item.name == value;
    })[0];
    this.countryForm.controls['code'].setValue(this.countryCaodeValue.phone_code);
    // console.log("country value", this.countryCaodeValue);

  }

  onSubmit() {
    console.log("   this.countryForm.value", this.countryForm.value);

    this.submitted = true;
    this.spinner.show();
    if (this.countryForm.invalid) {
      this.spinner.hide();
      return;
    }

    let uniqueval = this.countryList.filter((itm: any, i: any, a: any) => {
      // array of unique elements
      console.log("itm", itm);
      return this.countryForm.value.name == itm.name;
    });
    console.log("uniqueval", uniqueval);
    if (uniqueval.length) {
      this.toastr.showError("Dublicate Entry", 'Error');
      this.spinner.hide();
      this.countryForm.reset();

    } else {
      this._adminService.addCountry(this.userId, this.countryForm.value).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.toastr.showSuccess(res.message, 'Success');
          this.countryForm.reset();
          this.getCountryList();
        }
      });
    }


  }

  getCountryList() {
    this.spinner.show();
    this._adminService.getCountry(this.userId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {

      if (res.statusCode === 200) {
        this.countryList = res.result;
        console.log("country countryList", this.countryList);
      }
    })
  }
  editRow(row: any) {
    this.isRowEdit = true;
    console.log("row id", row.id);
    console.log("row", row);
    this.rowId = row.id;
    // this.countryForm.controls['code'].setValue(row.code);
    this.updatedCode = this.countryCodes.filter((item: any) => {
      return item.name === row.name;
    })[0].phone_code;

    this.countryForm.controls['name'].setValue(row.name);
    this.countryForm.controls['code'].setValue(this.updatedCode);
    this.countryForm.controls['currency'].setValue(row.currency);
    // this.selectCountry(row.name);
    console.log("rowupdated form value", this.countryForm.value);
    console.log("updatedCode", this.updatedCode);


  }
  rowDelete(id: any) {
    console.log("delete", id);

    this._adminService.deleteCountry(this.userId, id).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.toastr.showSuccess(result.message, 'Success');
        this.getCountryList();
      }
    });
  }

  updateRow() {
    this.isRowEdit = false;
    let data = {
      "name": this.countryForm.value['name'],
      "code": this.updatedCode,
      "currency": this.countryForm.value['currency'],
    }
    console.log("ser data", data);
    this._adminService.editCountry(this.userId, this.rowId, data).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.toastr.showSuccess(result.message, 'Success');
        this.countryForm.reset();
        this.getCountryList();

      }
    });
  }

}
