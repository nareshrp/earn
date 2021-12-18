import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/shared/services/notification.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { VendorService } from 'src/app/shared/services/vendor.service';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-create-deal',
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.css']
})
export class CreateDealComponent implements OnInit {
  public Editor = ClassicEditor;
  submitted = false;
  errorMsg = '';
  pageTitle: any;
  role: any;
  userId: any;
  createDealForm: FormGroup;

  /* Map Properties*/
  latitude: number;
  longitude: number;
  zoom: number = 18;
  address: string = '';
  geoCoder: any;
  // finalLocation:any={};
  // locationChosen = false;
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  map: any;
  mapClickListener: any;
  files: any = [];
  vfiles: any = [];
  imageAssetsFiles: any = [];

  shareImgfiles: any = [];
  dealImgObj: any;
  videoAssetsObj: any;
  imageAssetsObj: any;

  // sharedTypeList:any=[];
  sharedTypeList: any = [];
  acceptTerms: boolean = false;
  vendorList: any;
  selectedVendorID: any;
  radius: any = 10;
  vedInstrData: any;
  dealContentData: any;
  radiusMaster: any = [{ id: 1, value: 5 }, { id: 2, value: 10 }, { id: 3, value: 15 }, { id: 4, value: 20 }];
  bindingRadious: any;
  categoryList: any;
  countryName: any;
  videoAssetsObjFileName: any = [];
  videoAssetsObjFilePath: any = [];
  isVideoAssets: boolean = false;
  isImageAssets: boolean = false;

  imageAssetsFilesObjFileName: any = [];
  imageAssetsFilesObjFilePath: any = [];

  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private vendorService: VendorService,
    public adminService: AdminService,
  ) {
    this.latitude = 17.4264979;
    this.longitude = 78.45113220000007;
    this.createDealForm = this.fb.group({
      vendorId: [null],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      offerTitle: [null, [Validators.required]],
      dealImg: [null, [Validators.required]],
      dealContent: [null],
      sharedType: [null],
      vedInstr: [null],
      vAssets: [null],
      sharedImgInstr: [null],
      imageAssets: [null],

      campBudget: [null, [Validators.required]],
      bidPerCoin: [null],
      consentPolicy: [null, [Validators.required]],
      category: [null, [Validators.required]],
      isCoupon: [null],
    })
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    this.getActiveVendorList();
    this.mapInt();
    if (this.role != 'admin') {
      this.selectedVendorID = this.userId;
    }

    this.getCategoryList();

  }

  mapInt() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    });
  }

  changeRadious(val: any) {
    console.log("change", val);
    this.radius = parseInt(val);
    this.mapInt();
  }

  onChangeDealContent({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.dealContentData = data;
    this.createDealForm.value['dealContent'] = data;
    console.log(data);
  }
  onChangeVideoInstContent({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.vedInstrData = data;
    this.createDealForm.value['vedInstr'] = data;
    console.log(data);
  }

  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }
  get form() { return this.createDealForm.controls; }

  /* Map Functions */
  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      this.ngZone.run(() => {
        // Here we can get correct event
        // this.locationChosen = true;
        console.log(e.latLng.lat(), e.latLng.lng());
        this.latitude = e.latLng.lat();
        this.longitude = e.latLng.lng();
        this.getAddress(this.latitude, this.longitude);
      });
    });
  }

  radiusDragEnd($event: any) {
    console.log($event);
    let lat = $event.coords.lat;
    let lng = $event.coords.lng;
    // this.showHideMarkers();

    console.log(lat, lng);
  }

  centerChange($event: any) {
    console.log($event);
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 20;
        this.getAddress(this.latitude, this.longitude);

      });
    }
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 20;
          // console.log("results -----", results);
          this.countryName = results[results.length - 1].formatted_address;
          console.log("this.countryName", this.countryName);
          // console.log("results[0]", results[0]);
          this.address = results[0].formatted_address;
          // console.log("this.address", this.address);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
  backNavigation() {
    this.routerServices.navigate(['/deals'])
  }


  getActiveVendorList() {
    if (this.role == 'admin') {
      this.vendorService.getActiveVendorList(this.userId).subscribe((res: any) => {

        this.vendorList = res.result;
        console.log("this.vendorList", this.vendorList);
      });
    } else {
      console.log("vendor selectedVendorID", this.selectedVendorID);
      return;
    }

  }

  getVendorId(event: any) {
    console.log("vendorIdevent", event.target.value);
    this.selectedVendorID = event.target.value;
  }

  /* File Upload Logic */
  // We will create multiple form controls inside defined form controls photos.

  detectFiles(event: any, imgType: any) {
    console.log("imgType", imgType);
    let files = event.target.files;
    console.log("files", files);
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          //file.imgUrl = e.target.result;
          if (imgType == 'dealImg') {
            this.files.push(file);
          } else if (imgType == 'vAssets') {
            this.vfiles.push(file);
          } else if (imgType == 'imageAssets') {
            this.imageAssetsFiles.push(file);
          }
          else {
            this.shareImgfiles.push(file);
          }

          //console.log(e.target.result)
        }
        reader.readAsDataURL(file);
      }
    }
  }

  uploadDealImg() {
    this.spinner.show();
    var fd: any = new FormData();
    fd.append('files', this.files[0]);
    console.log("vendorService upload file ",);
    this.vendorService.fileUpload(this.userId, fd).pipe(finalize(() => {
      this.spinner.hide();
      // Success Tost Message
      // this.toastr.showSuccess("File Successfully Created !!", "Successfully");
    })).subscribe((result: any) => {
      console.log("result", result);
      if (result.result.statusCode === 200) {
        this.dealImgObj = {
          fileName: result.result.fileName,
          filePath: result.result.filePath
        };

        this.toastr.showSuccess(result.message, "Successfully");

      }
    });
  }

  async uploadVideoAssets() {
    this.spinner.show();

    for (let i = 0; i < this.vfiles.length; i++) {
      let fd: any = new FormData();
      fd.append('files', this.vfiles[i]);
      console.log("files" + i, this.vfiles[i]);
      await this.vendorService.fileUpload(this.userId, fd).pipe(finalize(() => {
        this.spinner.hide();
        // Success Tost Message
        // this.toastr.showSuccess("File Successfully Created !!", "Successfully");
      })).subscribe((res: any) => {

        if (res.result.statusCode === 200) {
          this.videoAssetsObjFileName.push(res.result.fileName);
          this.videoAssetsObjFilePath.push(res.result.filePath);
          this.toastr.showSuccess(res.message, "Successfully");

        }
      });
    };

    console.log("videoAssetsObjFileName -------------------", this.videoAssetsObjFileName);
    console.log("videoAssetsObjFilePath---------------------", this.videoAssetsObjFilePath);

  }

  async uploadImageAssets() {
    this.spinner.show();
    for (let i = 0; i < this.imageAssetsFiles.length; i++) {
      let fd: any = new FormData();
      fd.append('files', this.imageAssetsFiles[i]);
      console.log("files" + i, this.imageAssetsFiles[i]);
      await this.vendorService.fileUpload(this.userId, fd).pipe(finalize(() => {
        this.spinner.hide();
        // Success Tost Message
        // this.toastr.showSuccess("File Successfully Created !!", "Successfully");
      })).subscribe((res: any) => {

        if (res.result.statusCode === 200) {
          this.imageAssetsFilesObjFileName.push(res.result.fileName);
          this.imageAssetsFilesObjFilePath.push(res.result.filePath);
          this.toastr.showSuccess(res.message, "Successfully");

        }
      });
    };

    console.log("imageAssetsFilesObjFileName -------------------", this.imageAssetsFilesObjFileName);
    console.log("imageAssetsFilesObjFilePath---------------------", this.imageAssetsFilesObjFilePath);
  }

  resetBtn(btnName: any) {
    console.log(btnName);
    this.createDealForm.controls[btnName].reset();
  }

  sharetype(event: any, id: any) {
    let val = event.target.value;
    console.log("sharetype val", val);
    if (event.target.checked === true) {
      this.sharedTypeList.push(val);
      if (val == 'video') {
        this.isVideoAssets = true;
        this.createDealForm.controls['vAssets'].setValidators([Validators.required]);
      }
      if (val == 'image') {
        this.isImageAssets = true;
        this.createDealForm.controls['imageAssets'].setValidators([Validators.required]);
      }
    }
    else {
      // this.moduleData.slice(0, index);
      this.sharedTypeList.splice(this.sharedTypeList.indexOf(id));
      if (val == 'video') {
        this.isVideoAssets = false;
        this.createDealForm.controls['vAssets'].setValidators(null);
      }
      if (val == 'image') {
        this.isImageAssets = false;
        this.createDealForm.controls['imageAssets'].setValidators(null);
      }


    }

    console.log("sharetype", this.sharedTypeList);
  }

  termsCheck(event: any) {
    if (event.target.checked === true) {
      console.log("IF Condition", event.target.checked);
      this.createDealForm.value['consentPolicy'] = true;
      this.createDealForm.controls['consentPolicy'].setValidators([])
    }
    else {
      console.log("else Condition", event.target.checked);
      this.createDealForm.value['consentPolicy'] = false;
      this.createDealForm.controls['consentPolicy'].setValidators([Validators.required])
    }

  }

  isCouponCheck(event: any) {
    if (event.target.checked === true) {
      this.createDealForm.value['isCoupon'] = true;
    }
    else {
      this.createDealForm.value['isCoupon'] = false;
    }
  }

  getCategoryList() {
    this.adminService.getCategory(this.userId).pipe(finalize(() => {

    })).subscribe((res: any) => {

      if (res.statusCode === 200) {
        this.categoryList = res.result;
        console.log("categoryList", this.categoryList);
      }
    })
  }

  onBudgetBlur() {
    console.log(this.createDealForm.value['campBudget']);
    let data = {
      "country": this.countryName,
      "campBudget": this.createDealForm.value['campBudget']
    }
    this.adminService.getCoinPerBudget(this.userId, data).pipe(finalize(() => {

    })).subscribe((res: any) => {
      console.log(res);
      if (res.statusCode === 200) {
        this.createDealForm.controls['bidPerCoin'].setValue(res.coin.coins);

      }

    })
  }

  onSaveDeal() {

    this.submitted = true;
    if (this.createDealForm.invalid) {
      return;
    }

    console.log("DealObj", this.dealImgObj);
    console.log("videoAssetsObj", this.videoAssetsObj);
    let locationData = {
      address: this.address,
      latitude: this.latitude,
      longitude: this.longitude,
      radius: this.radius
    }
    this.videoAssetsObj = {
      fileName: this.videoAssetsObjFileName,
      filePath: this.videoAssetsObjFilePath
    };
    this.imageAssetsObj = {
      fileName: this.imageAssetsFilesObjFileName,
      filePath: this.imageAssetsFilesObjFilePath
    };

    this.createDealForm.value['dealImg'] = this.dealImgObj;
    this.createDealForm.value['vAssets'] = this.videoAssetsObj;
    this.createDealForm.value['imageAssets'] = this.imageAssetsObj;
    this.createDealForm.value['sharedType'] = this.sharedTypeList;
    this.createDealForm.value['vendorId'] = this.selectedVendorID;
    this.createDealForm.value['dealContent'] = this.dealContentData;
    this.createDealForm.value['vedInstr'] = this.vedInstrData;
    this.createDealForm.value['location'] = locationData;
    console.log("Form Value", this.createDealForm.value);
    this.spinner.show();
    this.vendorService.createDeal(this.userId, this.createDealForm.value).pipe(finalize(() => {
      this.spinner.hide();

    })).subscribe((res: any) => {
      this.toastr.showSuccess(res.message, "Successfully");
      this.routerServices.navigate(['/deals']);
      this.createDealForm.reset();
    });


  }


}
