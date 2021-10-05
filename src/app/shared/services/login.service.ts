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


}
