import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { NotificationService } from 'src/app/shared/services/notification.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errorMsg = '';
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
  }

  ngOnInit(): void {

  }

  // convenience getter for easy access to form fields
  get form() { return this.loginForm.controls; }

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



}
