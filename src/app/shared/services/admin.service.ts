import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }
  getVendorList(role: any) {
    return this.http.get(environment.apiUrl + "/api/earnin/users/" + role + "/approve?status=pending");
  }
}
