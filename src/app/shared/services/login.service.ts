import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }
  //User Validator
  validateUser(data: any) {
    let username = data.username;
    let password = data.password;
    const body = {
      "username": username.trim(),
      "password": password
    }
    return this.http.post(environment.apiUrl + "/api/earnin/signin", body);
  }

  verifyMobile(mobileNumber: any) {
    return this.http.post(environment.apiUrl + "/api/earnin/signup/otp", mobileNumber);
  }
  verifyOTP(body: any) {
    return this.http.post(environment.apiUrl + "/api/earnin/signup/verify", body);
  }
  userSignUp(body: any) {
    return this.http.post(environment.apiUrl + "/api/earnin/signup", body);
  }



  loginVerifyMobile(mobileNumber: any) {
    return this.http.post(environment.apiUrl + "/api/earnin/signin", mobileNumber);
  }
  
  loginVerifyOTP(body: any) {
    return this.http.post(environment.apiUrl + "/api/earnin/signin/token", body);
  }

}
