import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http: HttpClient) { }
  getActiveVendorList(role: any) {
    return this.http.get(environment.apiUrl + "/api/earnin/users/" + role + "/approve?status=active");
  }
  fileUpload(userId: any, body: any) {
    return this.http.post(environment.apiUrl + "/api/earnin/users/" + userId + "/file", body);
  }
  createDeal(userId: any, body: any) {
    return this.http.post(environment.apiUrl + "/api/earnin/users/" + userId + "/deal", body);
  }
  getDeals(userId: any) {
    let role = localStorage.getItem('role');
    if (role != 'admin') {
      return this.http.get(environment.apiUrl + "/api/earnin/deals?vendorId=" + userId);
    }
    else {
      return this.http.get(environment.apiUrl + "/api/earnin/deals");
    }

  }

  verifyCoupon(userId: any, body: any) {
    return this.http.put(environment.apiUrl + "/api/earnin/users/" + userId + "/coupon/verify", body);
  }

  actionDeal(userId: any, dealId: any, body: any) {
    return this.http.put(environment.apiUrl + "/api/earnin/users/" + userId + "/deals/" + dealId + "/status", body);
  }


}
