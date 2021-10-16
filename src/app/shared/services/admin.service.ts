import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(private http: HttpClient) { }
  getVendorList(role: any, status:any) {
    return this.http.get(environment.apiUrl + "/api/earnin/users/" + role + "/approve?status="+status);
  }

  getActiveVendorList(role: any) {
    return this.http.get(environment.apiUrl + "/api/earnin/users/" + role + "/approve?status=active");
  }

  pendingApproval(userId: any, body: any) {
    return this.http.put(environment.apiUrl + "/api/earnin/users/" + userId + "/approve", body);
  }

  getCountryCode() {
    return this.http.get(environment.apiUrl + "/api/earnin/countrycode/");
  }

  addCountry(userId: any, body: any) {
    return this.http.post(environment.apiUrl + "/api/earnin/users/" + userId + "/country", body);
  }
  getCountry(userId: any) {
    return this.http.get(environment.apiUrl + "/api/earnin/users/" + userId + "/country");
  }
  editCountry(userId: any, cId: any, body: any) {
    return this.http.put(environment.apiUrl + "/api/earnin/users/" + userId + "/country/" + cId, body);
  }
  deleteCountry(userId: any, cId: any) {
    return this.http.delete(environment.apiUrl + "/api/earnin/users/" + userId + "/country/" + cId);
  }

  addCity(userId: any, body: any) {
    return this.http.post(environment.apiUrl + "/api/earnin/users/" + userId + "/city", body);
  }
  getAllCities(userId: any) {
    return this.http.get(environment.apiUrl + "/api/earnin/users/" + userId + "/city",);
  }
  updateCity(userId: any, cityId: any, body: any) {
    return this.http.put(environment.apiUrl + "/api/earnin/users/" + userId + "/city/" + cityId, body);
  }

  deleteCity(userId: any, cityId: any) {
    return this.http.delete(environment.apiUrl + "/api/earnin/users/" + userId + "/city/" + cityId);
  }

  addCategory(userId: any, body: any) {
    return this.http.post(environment.apiUrl + "/api/earnin/users/" + userId + "/category", body);
  }

  getCategory(userId: any) {
    return this.http.get(environment.apiUrl + "/api/earnin/users/" + userId + "/category");
  }

  updateCategory(userId: any, categoryId: any, body: any) {
    return this.http.put(environment.apiUrl + "/api/earnin/users/" + userId + "/category/" + categoryId, body);
  }

  deleteCategory(userId: any, categoryId: any) {
    return this.http.delete(environment.apiUrl + "/api/earnin/users/" + userId + "/category/" + categoryId);
  }

}
