import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private routerServices: Router) { }
  canActivate(): boolean {
    if (window.localStorage.getItem('username')) {
      return true;
    }
    else {
      return false;
    }
  }
  logout() {
    // localStorage.removeItem('currentUser');
    // this.currentUserSubject.next(null);
    localStorage.clear();
    this.routerServices.navigate(['/login']);
    return true;

  }
}
