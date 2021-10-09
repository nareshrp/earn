import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  pageTitle: any;
  cityForm: FormGroup;
  countryCodes:any;
  isRowEdit:boolean=false;
  role:any;
  userId:any;
  submitted = false;
  countryList:any;
  cityList:any;

  rowId:any;
  updatedCountryId:any;
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
   public routerServices: Router,
   private _adminService: AdminService,
  ) { 
    this.cityForm = this.fb.group({
      name: [null, [Validators.required]],
      countryId: [null],
    });
  }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    // this.getCountryCodeData();
    this.getCountryList();
    this.getAllMyCities();
  }

  get form() { return this.cityForm.controls; }
  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }
  // getCountryCodeData(){
  //   this._adminService.getCountryCode().subscribe((result:any)=>{
        
  //       if(result.statusCode===200){
  //         this.countryCodes=result.result;
  //         console.log("country codes",  this.countryCodes);
  //       }
  //   });
  // }


  getCountryList(){
       this._adminService.getCountry(this.userId).pipe(finalize(() => {
     
    })).subscribe((res:any)=>{

      if(res.statusCode===200){
       this.countryList=res.result;  
       console.log("country countryList", this.countryList);
      }
    })
  }

  getAllMyCities(){
    this.spinner.show();
    this._adminService.getAllCities(this.userId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res:any)=>{

      if(res.statusCode===200){
       this.cityList=res.result;  
       console.log("cityList", this.cityList);
      }
    })
  }

  editRow(row:any){
    this.isRowEdit=true;
    console.log("row id", row.id);
    console.log("row", row);
    this.rowId=row.id;
    
    this.updatedCountryId=this.countryList.filter((item:any)=>{
      console.log("item", item);
      return item.code===row.countryId;
    });

    console.log("updatedCountryId", this.updatedCountryId);
   
   this.cityForm.controls['name'].setValue(row.name);
  //  this.countryId.controls['code'].setValue(this.updatedCode);
  //   // this.selectCountry(row.name);
  //   console.log("rowupdated form value", this.countryForm.value);
  //   console.log("updatedCode", this.updatedCode);
  
    
  }

  rowDelete(id:any){
    this._adminService.deleteCity(this.userId,id).subscribe((result:any)=>{
      if(result.statusCode===200){
        this.toastr.showSuccess(result.message, 'Success');
        this.getAllMyCities();
      }
    });
}


  onSubmit(){
    this.submitted = true;
    this.spinner.show();
    if (this.cityForm.invalid) {
      return;
    }

    this._adminService.addCity(this.userId, this.cityForm.value).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res:any)=>{
      if(res.statusCode===200){
        this.toastr.showSuccess(res.message, 'Success');
        this.cityForm.reset();
        this.getAllMyCities();
       
      }
    })
  }
}


