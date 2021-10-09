import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  pageTitle: any;
  categoryForm: FormGroup;
  submitted = false;
  role:any;
  categoryList: any;
  userId:any;
  isUpdateBt:boolean=false;
  isSaveBt:boolean=true;
  updateId:any;
  constructor(
    private activatedRouterServices: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
    private fb: FormBuilder,
    public routerServices: Router,
    private _adminService: AdminService,
   
  ) {
    this.categoryForm = this.fb.group({
      name: [null, [Validators.required]]     
    });

   }
   get form() { return this.categoryForm.controls; }
  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");
    this.getPageTitle();
    this.getCategoryList();

  }

  getPageTitle() {
    this.activatedRouterServices.data.subscribe((result: any) => {
      this.pageTitle = result.title;
    })
  }





  // getAllMyCities(){
  //   this.spinner.show();
  //   this._adminService.getAllCities(this.userId).pipe(finalize(() => {
  //     this.spinner.hide();
  //   })).subscribe((res:any)=>{

  //     if(res.statusCode===200){
  //      this.cityList=res.result;  
  //      console.log("cityList", this.cityList);
  //     }
  //   })
  // }

  getCategoryList(){
    this._adminService.getCategory(this.userId).pipe(finalize(() => {
  
 })).subscribe((res:any)=>{

   if(res.statusCode===200){
    this.categoryList=res.result;  
    console.log("categoryList", this.categoryList);
   }
 })
}


editCategoryRow(row:any){
  this.isUpdateBt=true;
  this.isSaveBt=false;
  this.updateId = row.id 
  this.categoryForm.controls['name'].setValue(row.name);
  console.log('row', row);
}



deleteCategoryRow(id:any){
  this._adminService.deleteCategory(this.userId,id).subscribe((result:any)=>{
    if(result.statusCode===200){
      this.toastr.showSuccess(result.message, 'Success');
      this.getCategoryList();
      console.log('deleteCategory',  this.categoryList);      
    }
  });
}


updateRow(){
  this.isUpdateBt=false;
  this.isSaveBt=true;
  this.categoryForm.value['name'],
    this._adminService.updateCategory(this.userId,this.updateId,this.categoryForm.value).subscribe((result:any)=>{
      if(result.statusCode===200){
        this.toastr.showSuccess(result.message, 'Success');
        this.getCategoryList();
      }  
    });
 
}


  onSubmit(){
    this.submitted = true;
    this.spinner.show();
    if (this.categoryForm.invalid) {
      return;
    }

    this._adminService.addCategory(this.userId, this.categoryForm.value).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res:any)=>{
      console.log('res', res);
        if(res.statusCode===200){
          this.toastr.showSuccess(res.message, 'Success');
          this.categoryForm.reset();   
          this.getCategoryList();    
        }
    });
  }





}
