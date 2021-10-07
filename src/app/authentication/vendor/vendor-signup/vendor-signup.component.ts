import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { LoginService } from 'src/app/shared/services/login.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-vendor-signup',
  templateUrl: './vendor-signup.component.html',
  styleUrls: ['./vendor-signup.component.css']
})
export class VendorSignupComponent implements OnInit {
  vendorSignUpForm: FormGroup;
  submitted = false;
  errorMsg = '';
  isOtp: boolean = false;
  isMobileVerify: boolean = false;
  rolesList: any = [{ id: 1, role: "admin" }, { id: 2, role: "user" }, { id: 3, role: "vendor" }];

  latitude: number;
  longitude: number;
  zoom: number = 18;
  address: string = '';
  geoCoder: any;
  locationChosen = false;
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  map: any;
  mapClickListener: any;
  businessCategoryList: any = [{ id: 1, name: "Fashion" }, { id: 2, name: "Grocery" }, { id: 3, name: "Medical" }];
  targetAudienceList: any = [{ id: 1, name: "Male" }, { id: 2, name: "Female" }, { id: 3, name: "All" }];
  audienceAgeList: any = [{ id: 1, name: "0 to 20" }, { id: 2, name: "20 to 40" }, { id: 3, name: "40 to 60" }];
  constructor(
    private fb: FormBuilder,
    private _loginServices: LoginService,
    public routerServices: Router,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
    this.latitude = 17.4264979;
    this.longitude = 78.45113220000007;
    this.vendorSignUpForm = this.fb.group({
      bName: [null, [Validators.required]],
      bPhone: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      bCategory: [null, [Validators.required]],
      audAge: [null, [Validators.required]],
      targAud: [null, [Validators.required]],
      name: [null, [Validators.required]],
      bLoc: [null],
      phone: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      role: ['vendor'],
      otp: [null],

    });
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    });
  }

  // onChoseLocation(event:any){
  //     console.log("event", event.coords);
  //     this.latitude=event.coords.lat;
  //     this.longitude=event.coords.lng;
  //     // this.locationChosen=true;
  // }

  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      this.ngZone.run(() => {
        // Here we can get correct event
        this.locationChosen = true;
        console.log(e.latLng.lat(), e.latLng.lng());
        this.latitude = e.latLng.lat();
        this.longitude = e.latLng.lng();
        this.getAddress(this.latitude, this.longitude);
      });
    });
  }


  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);

      });
    }
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  get form() { return this.vendorSignUpForm.controls; }
  phoneNumberVerify() {
    this.spinner.show();
    console.log("Phone", this.vendorSignUpForm.value['phone']);
    if (this.vendorSignUpForm.value['phone'] != null) {
      let data = {
        phone: this.vendorSignUpForm.value['phone']
      }
      this._loginServices.verifyMobile(data).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe((result: any) => {
        console.log("result", result);
        if (result.statusCode === 200) {
          this.isOtp = true;
          this.toastr.showSuccess(result.message, 'Success');
        }
        else {
          this.toastr.showError(result.message, 'Error');
        }
      });
    }



  }
  otpVerify() {
    this.spinner.show();
    console.log("Otp", this.vendorSignUpForm.value['otp']);
    let data = {
      phone: this.vendorSignUpForm.value['phone'],
      code: this.vendorSignUpForm.value['otp'],
    }
    this._loginServices.verifyOTP(data).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((result: any) => {
      console.log("result", result);
      if (result.statusCode === 200) {
        this.isOtp = false;
        this.isMobileVerify = true;
        this.toastr.showSuccess(result.message, 'Success');

      }


    });
  }
  onSubmit() {
    // this.spinner.show();
    console.log(this.vendorSignUpForm)
     this.spinner.show();
    this.submitted = true;
    if (this.vendorSignUpForm.invalid) {
      return;
    }

    if (this.isMobileVerify === true) {
      delete this.vendorSignUpForm.value['otp'];
      let addressBlock = {
        address: this.address
      }
      this.vendorSignUpForm.value['bLoc'] = addressBlock;
      console.log("form Value", this.vendorSignUpForm.value);
      this._loginServices.userSignUp(this.vendorSignUpForm.value).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe((resp: any) => {
        console.log("User signup", resp);
        if (resp.statusCode === 200) {
          this.toastr.showSuccess(resp.message, 'Success');
          this.routerServices.navigate(['/vendor/login']);
        }
      });
    }


  }
}
