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
  countryCodes:any;
  countryCaodeValue:any;
  role:any;
  userId:any;
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
      code: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    this.getCountryCodeData();
  }

  get form() { return this.countryForm.controls; }
  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }

  getCountryCodeData(){
    this._adminService.getCountryCode().subscribe((result:any)=>{
        
        if(result.statusCode===200){
          this.countryCodes=result.result;
          console.log("country codes",  this.countryCodes);
        }
    });
  }

  selectCountry(value:any){
      console.log(value);
      this.countryCaodeValue = this.countryCodes.filter((item:any)=>{
        return item.code===value;
      });
      console.log("country value", this.countryCaodeValue);
    
  }

  onSubmit(){
    this.submitted = true;
    this.spinner.show();
    if (this.countryForm.invalid) {
      return;
    }

    this._adminService.addCountry(this.userId, this.countryForm.value).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res:any)=>{
      if(res.statusCode===200){
        this.toastr.showSuccess(res.message, 'Success');
        this.countryForm.reset();
      }
    })


  }

}
