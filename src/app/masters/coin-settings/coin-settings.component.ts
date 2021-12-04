import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-coin-settings',
  templateUrl: './coin-settings.component.html',
  styleUrls: ['./coin-settings.component.css']
})
export class CoinSettingsComponent implements OnInit {
  pageTitle: any;
  coinsSettingForm: FormGroup;
  conditionForm: FormGroup;
  role: any;
  userId: any;
  submitted = false;
  isRowEdit: boolean = false;
  rowId: any;
  countryCoinsData: any;
  settingCoinsList: any;
  shareType: any = [
    { val: "imgViewSettings", type: 'Image Share' }, 
    { val: "videoViewSettings", type: 'Video Share' }, 
    { val: "linkViewSettings", type: 'Link View' }, 
    { val: "couponViewSettings", type: 'Coupon Share' }
  ];
  conditionalType: any = [{ val: "lt", type: '<' }, { val: "gt", type: '>' }, { val: "eq", type: '=' }, { val: "lte", type: '<=' }, { val: "gte", type: '>=' }];
  actionType: any = [{ action:"RHF", desc : 'Release Holded funds' },{ action:"HF", desc : 'Holded funds' }, { action:"NA", desc : 'Not applicable' }];
  conditionsList: any = [];
  dynamicKey: any;
  updatedRowId: any;

  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
    private _adminService: AdminService,
  ) {
    // this.coinsSettingForm = this.fb.group({
    //   country: [null, [Validators.required]],
    //   currency: [null],
    //   coinVAl: [null],
    //   threshold: [null, [Validators.required]],
    //   imgViewVal: [null, [Validators.required]],
    //   videoViewVal: [null, [Validators.required]],
    //   defaultCoin: [null, [Validators.required]],
    //   withdrawThreshold: [null, [Validators.required]],
    // });

    this.coinsSettingForm = this.fb.group({
      imgDefaultCoin: [null],
      videoDefaultCoin: [null],

    });

    this.conditionForm = this.fb.group({
      operator: [null,[Validators.required]],
      threshold: [null, [Validators.required]],
      coin: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      action: [null, [Validators.required]],

    });



  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    this.getCountryListWithCoinsData();
    this.getSettingCoinsDataList();
  }
  get form() { return this.coinsSettingForm.controls; }
  get cform() { return this.conditionForm.controls; }
  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }

  getCountryListWithCoinsData() {
    this._adminService.getCountryWithCoins(this.userId).pipe(finalize(() => {

    })).subscribe((res: any) => {

      if (res.statusCode === 200) {
        this.countryCoinsData = res.result;
        // console.log("country countryCoinsData", this.countryCoinsData);
      }
    })
  }

  countryChange(event: any) {

    let eventVal = event.target.value;
    let filterVal = this.countryCoinsData.filter((item: any) => {
      return item.code === eventVal;
    })[0];
    console.log(filterVal);
    this.coinsSettingForm.controls['currency'].setValue(filterVal.currency);
    this.coinsSettingForm.controls['coinVAl'].setValue(filterVal.coinVal);
  }

  editRow(condition: any, type: any, row: any) {
    this.isRowEdit = true;

    console.log("condition", condition);
    console.log("type", type);
    console.log("row", row);
    if (type == 'imgView') {
      this.updatedRowId = row._id;
      console.log("linkView row", this.updatedRowId);
      this.coinsSettingForm.controls['imgDefaultCoin'].setValue(condition.imgDefaultCoin);
      this.coinsSettingForm.controls['videoDefaultCoin'].setValue(condition.videoDefaultCoin);
      this.onChangeSharetype("imgViewSettings");
      this.dynamicKey = "imgViewSettings";
      this.conditionForm.controls['coin'].setValue(row.coin);
      this.conditionForm.controls['operator'].setValue(row.operator);
      this.conditionForm.controls['threshold'].setValue(row.threshold);
      this.conditionForm.controls['currency'].setValue(row.currency);
      this.conditionForm.controls['action'].setValue(row.action);
    }else if (type == 'videoView') {
      this.updatedRowId = row._id;
      console.log("videoView row", this.updatedRowId);
      this.coinsSettingForm.controls['imgDefaultCoin'].setValue(condition.imgDefaultCoin);
      this.coinsSettingForm.controls['videoDefaultCoin'].setValue(condition.videoDefaultCoin);
      this.onChangeSharetype("videoViewSettings");
      this.dynamicKey = "videoViewSettings";
      this.conditionForm.controls['coin'].setValue(row.coin);
      this.conditionForm.controls['operator'].setValue(row.operator);
      this.conditionForm.controls['threshold'].setValue(row.threshold);
      this.conditionForm.controls['currency'].setValue(row.currency);
      this.conditionForm.controls['action'].setValue(row.action);
    }
    else{
      this.updatedRowId = row._id;
      console.log("linkViewSettings row", this.updatedRowId);
      this.coinsSettingForm.controls['imgDefaultCoin'].setValue(condition.imgDefaultCoin);
      this.coinsSettingForm.controls['videoDefaultCoin'].setValue(condition.videoDefaultCoin);
      this.onChangeSharetype("linkViewSettings");
      this.dynamicKey = "linkViewSettings";
      this.conditionForm.controls['coin'].setValue(row.coin);
      this.conditionForm.controls['operator'].setValue(row.operator);
      this.conditionForm.controls['threshold'].setValue(row.threshold);
      this.conditionForm.controls['currency'].setValue(row.currency);
      this.conditionForm.controls['action'].setValue(row.action);
    }

  }




  getSettingCoinsDataList() {
    this._adminService.getCoinData(this.userId).pipe(finalize(() => {

    })).subscribe((res: any) => {
      console.log("res", res);
      if (res.statusCode === 200) {
        this.settingCoinsList = res.coinsSetting;
        console.log("settingCoinsList", this.settingCoinsList);
      }
    })
  }
  onSubmit() {

    // console.log("form Val", this.coinsForm.value);
    this.submitted = true;
    this.spinner.show();

    if (this.coinsSettingForm.invalid) {
      this.spinner.hide();
      return;
    }

    let uniqueval = this.settingCoinsList.filter((item: any, i: any, a: any) => {
      // array of unique elements
      console.log("item", item);
      return this.coinsSettingForm.value.currency == item.currency;
    });

    if (uniqueval.length) {
      this.toastr.showError("Dublicate Entry", 'Error');
      this.spinner.hide();
      this.coinsSettingForm.reset();

    } else {
      this._adminService.addCoinSettings(this.userId, this.coinsSettingForm.value).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe((res: any) => {
        console.log("res", res);
        if (res.statusCode === 200) {
          this.toastr.showSuccess(res.message, 'Success');
          this.getSettingCoinsDataList();
          this.coinsSettingForm.reset();
          // this.getAllMyCities();

        }
      });
    }




  }

  onChangeSharetype(event: any) {
    // console.log("event type", event.target.value);
    if (event != '' && event.target != undefined) {
      if (event.target.value != "") {
        this.dynamicKey = event.target.value;
        console.log("if", event.target.value);
      }
      else {

        this.dynamicKey = event;
        console.log("else", event);
      }

    }
    else {
      console.log("else else", event);
      this.dynamicKey = event;
    }

  }

  addCondition() {
    this.submitted = true;
    this.spinner.show();
    if (this.conditionForm.invalid) {
      this.spinner.hide();
      return;
    }
    

    let newObject = {
      defaultImageShare: this.coinsSettingForm.value['imgDefaultCoin'],
      videoDefaultCoin: this.coinsSettingForm.value['videoDefaultCoin'],
      [this.dynamicKey]: this.conditionForm.value
    }
    this._adminService.addCoinSettings(this.userId, newObject).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      console.log("res", res);
      if (res.statusCode === 200) {
        this.toastr.showSuccess(res.message, 'Success');
        this.getSettingCoinsDataList();
        this.conditionForm.reset();
        // this.getAllMyCities();

      }
    });
  }

  updateRow() {
    this.isRowEdit = false;

    let newObject = {
      defaultImageShare: this.coinsSettingForm.value['imgDefaultCoin'],
      videoDefaultCoin: this.coinsSettingForm.value['videoDefaultCoin'],
      [this.dynamicKey]: this.conditionForm.value
    }

    console.log("updateRow", newObject);
    this._adminService.editCoinSetting(this.userId, this.updatedRowId, newObject).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.toastr.showSuccess(result.message, 'Success');
        // this.coinsSettingForm.reset();
        this.conditionForm.reset();
        this.getSettingCoinsDataList();

      }
    });
  }

  rowDelete(id: any) {
    console.log("delete", id);
    
    this._adminService.deleteCoinSetting(this.userId, id).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.toastr.showSuccess(result.message, 'Success');
        this.getSettingCoinsDataList();
      }
    });
  }





}
