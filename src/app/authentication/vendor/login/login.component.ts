import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { LoginService } from 'src/app/shared/services/login.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  phoneLoginForm: FormGroup;
  submitted = false;
  phSubmitted = false;
  errorMsg = '';
  isOtpFormGroup: boolean = false;
  // isMobileVerify: boolean = false;
  constructor(
    private fb: FormBuilder,
    private _loginServices: LoginService,
    public routerServices: Router,
    private spinner: NgxSpinnerService,
    private toastr: NotificationService,
  ) {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    this.phoneLoginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      phoneOtp: [null, [Validators.required]]
    });

  }




  ngOnInit(): void {

  }

  // convenience getter for easy access to form fields
  get form() { return this.loginForm.controls; }
  get formph() { return this.phoneLoginForm.controls; }


  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.spinner.show();

    console.log("login form", this.loginForm.value);

    let data = {
      username: this.loginForm.value.userName,
      password: this.loginForm.value.password
    }
    console.log("data", data);

    this._loginServices.validateUser(data).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      console.log("res", res);
      if (res.statusCode == 200) {
        let userInfo = res.result;
        console.log("userInfo", userInfo);
        // localStorage.setItem('usernameInfo', JSON.stringify(userInfo));
        localStorage.setItem('userId', userInfo.userId);
        localStorage.setItem('role', userInfo.role);
        localStorage.setItem('hashToken', userInfo.accessToken);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.toastr.showSuccess("Login Successfully", "Success")
        this.routerServices.navigate(['/']);
      }
    });
  }



  phoneNumberVerify() {
    //this.isOtpFormGroup = true;
    // console.log('', this.phoneLoginForm.value)

    this.spinner.show();
    console.log("Phone", this.phoneLoginForm.value['phone']);

    if (this.phoneLoginForm.value['phone'] != null) {
      let data = {
        phone: this.phoneLoginForm.value['phone']
      }
      this._loginServices.loginVerifyMobile(data).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe((result: any) => {
        console.log("result", result);
        if (result.statusCode === 200) {
          this.isOtpFormGroup = true;
          this.toastr.showSuccess(result.message, 'Success');
        }
        else {
          this.toastr.showError(result.message, 'Error');
        }
      });
    }
  }

  phoneOtpVerify() {
    this.spinner.show();
    console.log("phoneOtp", this.phoneLoginForm.value['phoneOtp']);
    if (this.phoneLoginForm.value['phoneOtp'] != null) {
      let data = {
        phone: this.phoneLoginForm.value['phoneOtp']
      }
      this._loginServices.loginVerifyOTP(data).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe((result: any) => {
        console.log("phoneOtp", result);
        if (result.statusCode === 200) {
          this.isOtpFormGroup = true;
          this.toastr.showSuccess(result.message, 'Success');
        }
        else {
          this.toastr.showError(result.message, 'Error');
        }
      });
    }
  }

  onPhoneFormSubmit() {
    this.phSubmitted = true;
    if (this.phoneLoginForm.invalid) {
      return;
    }
    this.spinner.show();
    let data = {
      phone: this.phoneLoginForm.value['phone'],
      code: this.phoneLoginForm.value['phoneOtp'],
    }
    console.log('data', data);

    this._loginServices.loginVerifyOTP(data).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((result: any) => {

      if (result.statusCode === 200) {
        console.log('res', result);
        this.isOtpFormGroup = true;
        this.toastr.showSuccess(result.message, 'Success');
        let userInfo = result.result;
        localStorage.setItem('userId', userInfo.userId);
        localStorage.setItem('role', userInfo.role);
        localStorage.setItem('hashToken', userInfo.accessToken);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.routerServices.navigate(['/']);
      }
      else {
        this.toastr.showError(result.message, 'Error')
      }
    });




  }



}

