import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { LoginService } from 'src/app/shared/services/login.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {
  userSignUpForm: FormGroup;
  submitted = false;
  errorMsg = '';
  isOtp: boolean = false;
  isMobileVerify: boolean = false;
  rolesList: any = [{ id: 1, role: "admin" }, { id: 2, role: "user" }]
  constructor(
    private fb: FormBuilder,
    private _loginServices: LoginService,
    public routerServices: Router,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
  ) {
    this.userSignUpForm = this.fb.group({
      name: [null, [Validators.required]],
      emailId: [null, [Validators.required, Validators.email]],
      role: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      password: [null, [Validators.required]],
      otp: [null],

    });
  }

  ngOnInit(): void {

  }

  get form() { return this.userSignUpForm.controls; }
  phoneNumberVerify() {
    this.spinner.show();
    console.log("Phone", this.userSignUpForm.value['phone']);
    if (this.userSignUpForm.value['phone'] != null) {
      let data = {
        phone: this.userSignUpForm.value['phone']
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
    console.log("Otp", this.userSignUpForm.value['otp']);
    let data = {
      phone: this.userSignUpForm.value['phone'],
      code: this.userSignUpForm.value['otp'],
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
    this.spinner.show();
    console.log(this.userSignUpForm)
    // this.spinner.show();
    this.submitted = true;
    if (this.userSignUpForm.invalid) {
      return;
    }
    if (this.isMobileVerify === true) {
      delete this.userSignUpForm.value['otp'];
      console.log("form Value", this.userSignUpForm.value);
      this._loginServices.userSignUp(this.userSignUpForm.value).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe((resp: any) => {
        console.log("User signup", resp);
        if (resp.statusCode === 200) {
          this.toastr.showSuccess(resp.message, 'Success');
          this.routerServices.navigate(['/login']);
        }
      });
    }


  }

}
