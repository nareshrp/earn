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
  countryList:any;
  isRowEdit:boolean=false;
  rowId:any;
  updatedCode:any;
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

  getCountryCodeData(){
    this._adminService.getCountryCode().subscribe((result:any)=>{
        
        if(result.statusCode===200){
          this.countryCodes=result.result;
          // console.log("country codes",  this.countryCodes);
        }
    });
  }

  selectCountry(value:any){
      console.log(value);
      this.countryCaodeValue = this.countryCodes.filter((item:any)=>{
        return item.code===value;
      })[0];
      this.countryForm.controls['code'].setValue(this.countryCaodeValue.phone_code);
      // console.log("country value", this.countryCaodeValue);
    
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
        this.getCountryList();
      }
    })
  }

  getCountryList(){
    this.spinner.show();
    this._adminService.getCountry(this.userId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res:any)=>{

      if(res.statusCode===200){
       this.countryList=res.result;  
       console.log("country countryList", this.countryList);
      }
    })
  }
  editRow(row:any){
    this.isRowEdit=true;
    console.log("row id", row.id);
    console.log("row", row);
    this.rowId=row.id;
    // this.countryForm.controls['code'].setValue(row.code);
    this.updatedCode=this.countryCodes.filter((item:any)=>{
      return item.code===row.name;
    })[0].phone_code;
   
   this.countryForm.controls['name'].setValue(row.name);
   this.countryForm.controls['code'].setValue(this.updatedCode);
    // this.selectCountry(row.name);
    console.log("rowupdated form value", this.countryForm.value);
    console.log("updatedCode", this.updatedCode);
  
    
  }
  rowDelete(id:any){
      this._adminService.deleteCountry(this.userId,id).subscribe((result:any)=>{
        if(result.statusCode===200){
          this.toastr.showSuccess(result.message, 'Success');
        }
      });
  }

  updateRow(){
    this.isRowEdit=false;
    let data={
      "name" :this.countryForm.value['name'],
      "code" : this.updatedCode
    }
    console.log("ser data", data);
    this._adminService.editCountry(this.userId, this.rowId, data).subscribe((result:any)=>{
      if(result.statusCode===200){
        this.toastr.showSuccess(result.message, 'Success');
        this.getCountryList();
      }
    });
  }

}
