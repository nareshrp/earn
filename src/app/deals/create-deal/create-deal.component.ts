import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-create-deal',
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.css']
})
export class CreateDealComponent implements OnInit {

  pageTitle: any;
  role:any;
  userId:any;
  createDealForm:FormGroup;

/* Map Properties*/
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


  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { 
    this.latitude = 17.4264979;
    this.longitude = 78.45113220000007;
      this.createDealForm=this.fb.group({
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
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    });
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
backNavigation(){
  this.routerServices.navigate(['/deals'])
}


}