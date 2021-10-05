import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeConstantService {
  // isMenuFolded: boolean = false
  // isSideNavDark: boolean = false;
  // isMenuFoldedActived = new BehaviorSubject<boolean>(this.isMenuFolded);
  // isMenuFoldedChanges: Observable<boolean> = this.isMenuFoldedActived.asObservable();
  isMenuFoldedEvent: Subject<object> = new Subject<object>();

  constructor() { }

  // toggleFold(isFolded: boolean) {
  //   this.isMenuFoldedActived.next(isFolded);
  // }
}
