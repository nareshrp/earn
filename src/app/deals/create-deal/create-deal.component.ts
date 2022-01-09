import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/shared/services/notification.service';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as customBuild from '../../ckCustomBuild/build/ckeditor';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ChangeEvent, CKEditor5 } from '@ckeditor/ckeditor5-angular';
import { VendorService } from 'src/app/shared/services/vendor.service';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';
import { MyUploadAdapter } from './my-upload-adapter';



@Component({
  selector: 'app-create-deal',
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreateDealComponent),
      multi: true
    }
  ]
})
export class CreateDealComponent implements OnInit {
Editor = customBuild;
config: CKEditor5.Config ={
    
  // image: {
  //   // image plugin config
  //  // resizeUnit: 'px',
  //  styles: [
  //   'alignLeft', 'alignCenter', 'alignRight'
  // ],

  // // Configure the available image resize options.
  // resizeOptions: [
  //   {
  //     name: 'resizeImage:original',
  //     label: 'Original',
  //     value: null
  //   },
  //   {
  //     name: 'resizeImage:50',
  //     label: '25%',
  //     value: '25'
  //   },
  //   {
  //     name: 'resizeImage:50',
  //     label: '50%',
  //     value: '50'
  //   },
  //   {
  //     name: 'resizeImage:75',
  //     label: '75%',
  //     value: '75'
  //   }
  // ],


  //   toolbar: [ 
      
  //     'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 
  //     'imageStyle:alignRight',  'imageResize:75', 'imageResize:original',
  //   'linkImage', 'resizeImage','toggleImageCaption', 'imageTextAlternative' ,
  //   'resizeImage:50',
  //   'resizeImage:75',
  //   'resizeImage:original',
  //   'ImageResize',
  // ],
  //   // styles: [
  //   //   'full',
  //   //   'alignLeft',
  //   //   'alignRight'
  //   // ],
   
  // },
  toolbar: {
    items: [
      'heading', '|',
      'fontfamily', 'fontsize',
      'alignment',
      'fontColor', 'fontBackgroundColor', '|',
      'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
      'link', '|',
      'outdent', 'indent', '|',
      'bulletedList', '-', 'numberedList', '|',
      'code', 'codeBlock', '|',
      'insertTable', '|', 'imageUpload', 'blockQuote', '|',
      'todoList',
      'undo', 'redo', 
    ],
    shouldNotGroupWhenFull: true,
    
  },
  image: {
    // Configure the available styles.
    styles: [
      'alignLeft', 'alignCenter', 'alignRight'
    ],

    // Configure the available image resize options.
    resizeOptions: [
      {
        name: 'resizeImage:original',
        label: 'Original',
        value: null
      },
      {
        name: 'resizeImage:50',
        label: '25%',
        value: '25'
      },
      {
        name: 'resizeImage:50',
        label: '50%',
        value: '50'
      },
      {
        name: 'resizeImage:75',
        label: '75%',
        value: '75'
      }
    ],

    // You need to configure the image toolbar, too, so it shows the new style
    // buttons as well as the resize buttons.
    toolbar: [
      'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
      '|',
      'ImageResize',
      '|',
      'imageTextAlternative',
      'toggleImageCaption'
    ]
  },
  // simpleUpload: {
  //    The URL that the images are uploaded to.
  // uploadUrl: 'http://localhost:52536/api/Image/ImageUpload',

  //   Enable the XMLHttpRequest.withCredentials property.

  //},

  language: 'en'

  // plugins: [ Image, ImageResizeEditing, ImageResizeHandles],
 
 
};


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
  selectedCategory:any;
  userInfo:any;

  pceImg:any=[];
  vceImg:any=[];

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

  //   this.Editor.builtinPlugins = [
  //         Base64UploadAdapter                                                          // <--- ADDED
  // ];
  

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
      category: [null],
      isCoupon: [null],
    })
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.userInfo = localStorage.getItem("userInfo");

   
    this.getPageTitle();
    this.getActiveVendorList();
    this.mapInt();
    if (this.role != 'admin') {
      this.selectedVendorID = this.userId;
      this.selectedCategory=JSON.parse(this.userInfo).bCategory;
      console.log("userInfo", this.selectedCategory);
      this.createDealForm.controls['category'].setValue(this.selectedCategory);
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

  onReady(editor:any): void {

    if (editor.model.schema.isRegistered('image')) {
      editor.model.schema.extend('image', { allowAttributes: 'blockIndent' });
    }
     editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader:any ) => {
      loader.on('change:uploadResponse', (evt:any, name:any, val:any, oldval:any) => {
        if(val){
          console.log(val)  // object response {default: image_link }
          delete val.statusCode;
          this.pceImg.push(val);
          console.log("this.pceImg", this.pceImg);
        }
      })
      return new MyUploadAdapter(loader)
    };
    
}

onReadyVideo(editor:any): void {
  if (editor.model.schema.isRegistered('image')) {
    editor.model.schema.extend('image', { allowAttributes: 'blockIndent' });
  }
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader:any ) => {
    loader.on('change:uploadResponse', (evt:any, name:any, val:any, oldval:any) => {
      if(val){
        console.log(val)  // object response {default: image_link }
        delete val.statusCode;
        this.vceImg.push(val);
        console.log("this.vceImg", this.vceImg);
      }
    })
    return new MyUploadAdapter(loader)
  };
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
    let vendorCategory= this.vendorList.filter((item:any)=>{
      return item.userId==this.selectedVendorID;
    })[0].bCategory;
    console.log("vendorCategory", vendorCategory);
       this.selectedCategory=vendorCategory;
       this.createDealForm.controls['category'].setValue(this.selectedCategory);
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
          // console.log("video -------------", res.result);
          delete res.result.statusCode;
          this.videoAssetsObjFileName.push(res.result);
          // this.videoAssetsObjFilePath.push(res.result.filePath);
          this.toastr.showSuccess(res.message, "Successfully");


        }
      });
    };

    console.log("videoAssetsObjFileName -------------------", this.videoAssetsObjFileName);
    // console.log("videoAssetsObjFilePath---------------------", this.videoAssetsObjFilePath);

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
          delete res.result.statusCode;
          this.imageAssetsFilesObjFileName.push(res.result);
          // this.imageAssetsFilesObjFilePath.push(res.result.filePath);
          this.toastr.showSuccess(res.message, "Successfully");

        }
      });
    };

    console.log("imageAssetsFilesObjFileName -------------------", this.imageAssetsFilesObjFileName);
    // console.log("imageAssetsFilesObjFilePath---------------------", this.imageAssetsFilesObjFilePath);
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
    // this.videoAssetsObj =  this.videoAssetsObjFileName
    // this.imageAssetsObj = {
    //   fileName: this.imageAssetsFilesObjFileName,
    //   filePath: this.imageAssetsFilesObjFilePath
    // };

    this.createDealForm.value['dealImg'] = this.dealImgObj;
    this.createDealForm.value['vAssets'] =  this.videoAssetsObjFileName;
    this.createDealForm.value['imageAssets'] = this.imageAssetsFilesObjFileName;
    this.createDealForm.value['sharedType'] = this.sharedTypeList;
    this.createDealForm.value['vendorId'] = this.selectedVendorID;
    this.createDealForm.value['dealContent'] = this.dealContentData;
    this.createDealForm.value['vedInstr'] = this.vedInstrData;
    this.createDealForm.value['location'] = locationData;
    this.createDealForm.value['category'] = this.selectedCategory;
    this.createDealForm.value['pceImg'] = this.pceImg;
    this.createDealForm.value['vceImg'] = this.vceImg;

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
