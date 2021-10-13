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
  // locationChosen = false;
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  map: any;
  mapClickListener: any;
  files: any = [];
  vfiles: any = [];
  shareImgfiles: any = [];
  dealImgObj: any;
  videoAssetsObj: any;
  // sharedTypeList:any=[];
  sharedTypeList: any;
  acceptTerms: boolean = false;
  vendorList: any;
  selectedVendorID: any;
  radius: any = 10;
  vedInstrData: any;
  dealContentData: any;
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private vendorService: VendorService,
  ) {
    this.latitude = 17.4264979;
    this.longitude = 78.45113220000007;
    this.createDealForm = this.fb.group({
      vendorId: [null],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      offerTitle: [null, [Validators.required]],
      dealmg: [null],
      dealContent: [null],
      sharedType: [null],
      vedInstr: [null],
      vAssets: [null],
      sharedImgInstr: [null],
      campBudget: [null],
      bidPerCoin: [null],
      consentPolicy: [null],
    })
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    this.getActiveVendorList();
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    });
    if (this.role != 'admin') {
      this.selectedVendorID = this.userId;
    }

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
          this.address = results[0].formatted_address;
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
    if(this.role=='admin'){
      this.vendorService.getActiveVendorList(this.userId).subscribe((res: any) => {
        console.log("getActiveVendorList", res);
        this.vendorList = res.result;
      });
    }else{
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
          if (imgType == 'dealmg') {
            this.files.push(file);
          } else if (imgType == 'vAssets') {
            this.vfiles.push(file);
          } else {
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

  uploadVideoAssets() {
    this.spinner.show();
    var fd: any = new FormData();
    console.log(this.vfiles[0])
    fd.append('files', this.vfiles[0]);

    this.vendorService.fileUpload(this.userId, fd).pipe(finalize(() => {
      this.spinner.hide();
      // Success Tost Message
      // this.toastr.showSuccess("File Successfully Created !!", "Successfully");
    })).subscribe((result: any) => {

      if (result.result.statusCode === 200) {
        this.videoAssetsObj = {
          fileName: result.result.fileName,
          filePath: result.result.filePath
        };

        this.toastr.showSuccess(result.message, "Successfully");

      }
    });
  }

  resetBtn(btnName: any) {
    console.log(btnName);
    this.createDealForm.controls[btnName].reset();
  }

  // sharetype(event:any){
  //  let val=event.target.value;
  //  if(event.target.checked){
  //      console.log(event.target.value);
  //      this.sharedTypeList.push(val);
  //   }else{
  //     let el = this.sharedTypeList.find((itm:any) => itm===val);
  //     if(el)
  //     this.sharedTypeList.splice(this.sharedTypeList.indexOf(el),1);
  //   }

  //   console.log("sharedTypeList", this.sharedTypeList);
  // }
  sharetype(event: any) {
    let val = event.target.value;
    this.sharedTypeList = val;
    console.log("sharetype", this.sharedTypeList);
  }

  termsCheck(event: any) {
    if (event.target.checked) {
      this.createDealForm.value['consentPolicy'] = true;
    }
    else {
      this.createDealForm.value['consentPolicy'] = false;
    }

  }

  onSaveDeal() {
   this.spinner.show();
    this.submitted = true;
    if (this.createDealForm.invalid) {
      return;
    }
    console.log("DealObj", this.dealImgObj);
    console.log("videoAssetsObj", this.videoAssetsObj);
    this.createDealForm.value['dealmg'] = this.dealImgObj;
    this.createDealForm.value['vAssets'] = this.videoAssetsObj;
    this.createDealForm.value['sharedType'] = this.sharedTypeList;
    this.createDealForm.value['vendorId'] = this.selectedVendorID;
    this.createDealForm.value['dealContent'] = this.dealContentData;
    this.createDealForm.value['vedInstr'] = this.vedInstrData;
    console.log("Form Value", this.createDealForm.value);
    this.vendorService.createDeal(this.userId, this.createDealForm.value).pipe(finalize(() => {
      this.spinner.hide();

    })).subscribe((res: any) => {
      this.toastr.showSuccess(res.message, "Successfully");
      this.routerServices.navigate(['/deals']);
      this.createDealForm.reset();
    });


  }


}
