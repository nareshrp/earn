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
  shareType: any = [{ val: "imgViewSettings", type: 'Image Share' }, { val: "videoViewSettings", type: 'Video Share' }, { val: "linkViewSettings", type: 'Link View' }, { val: "couponViewSettings", type: 'Coupon Share' }];
  conditionalType: any = [{ val: "lt", type: '<' }, { val: "gt", type: '>' }, { val: "eq", type: '=' }, { val: "lte", type: '<=' }, { val: "gte", type: '>=' }];
  actionType: any = [{ id: 1, type: 'Release Holded funds' }, { id: 2, type: 'Holded funds' },  { id: 3, type: 'Not applicable' }];
  conditionsList: any = [];
  dynamicKey:any;
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
      operator: [null],
      threshold: [null],
      coin: [null],
      currency: [null],
      action: [null],
     
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
        console.log("country countryCoinsData", this.countryCoinsData);
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

  editRow(row: any, view:any) {
    this.isRowEdit = true;
    console.log("row id", row._id);
    console.log("row view",view);
    console.log("row", row);
    this.rowId = row._id;
    let data = this.settingCoinsList.filter((item:any)=>{
      return item._id==row._id;
    });
    console.log("data", data);
    // this.coinsSettingForm.controls['country'].setValue(row.country);
    // this.coinsSettingForm.controls['currency'].setValue(row.currency);
    // this.coinsSettingForm.controls['coinVAl'].setValue(row.coinVAl);
    // this.coinsSettingForm.controls['threshold'].setValue(row.threshold);
    // this.coinsSettingForm.controls['imgViewVal'].setValue(row.imgViewVal);
    // this.coinsSettingForm.controls['videoViewVal'].setValue(row.videoViewVal);
    // this.coinsSettingForm.controls['defaultCoin'].setValue(row.defaultCoin);
    // this.coinsSettingForm.controls['withdrawThreshold'].setValue(row.withdrawThreshold);

    

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

  updateRow() {
    this.isRowEdit = false;
    this._adminService.editCountry(this.userId, this.rowId, this.coinsSettingForm.value).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.toastr.showSuccess(result.message, 'Success');
        this.coinsSettingForm.reset();
        this.getSettingCoinsDataList();

      }
    });
  }

  getSettingCoinsDataList() {
    this._adminService.getCoinData(this.userId).pipe(finalize(() => {

    })).subscribe((res: any) => {
      console.log("res",res);
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

  onChangeSharetype(event:any){
      console.log("event type", event.target.value);
      this.dynamicKey=event.target.value;
  }

  addCondition() {
    this.spinner.show();
    let newObject ={
      defaultImageShare:this.coinsSettingForm.value['imgDefaultCoin'],
      videoDefaultCoin:this.coinsSettingForm.value['videoDefaultCoin'],
     [this.dynamicKey]:this.conditionForm.value
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

}
