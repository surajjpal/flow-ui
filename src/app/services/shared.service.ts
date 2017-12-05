import { Injectable } from '@angular/core';
import { Router, NavigationStart, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { User } from '../models/user.model';

@Injectable()
export class DataSharingService {
  sharedObject: any;

  setSharedObject(sharedObject: any) {
    this.sharedObject = sharedObject;
  }

  getSharedObject() {
    let tempObject = null;
    if (this.sharedObject) {
      tempObject = JSON.parse(JSON.stringify(this.sharedObject));
      this.sharedObject = null;
    }
    return tempObject;
  }
}

@Injectable()
export class UniversalUser {
  private user: User;

  setUser(user: User) {
    localStorage.setItem('universalUser', JSON.stringify(user));
    this.user = user;
  }

  getUser() {
    if (!this.user) {
      this.user = JSON.parse(localStorage.getItem('universalUser'));
    }

    return this.user;
  }

  removeUser() {
    this.user = null;
    localStorage.removeItem('universalUser');
  }
}

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private universalUser: UniversalUser
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.universalUser.getUser()) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

@Injectable()
export class AntiAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private universalUser: UniversalUser
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.universalUser.getUser()) {
      // logged in so return false and navigate to home page
      this.router.navigate(['/pages']);
      return false;
    }

    // not logged in so redirect to login page
    return true;
  }
}

@Injectable()
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  success(message: string, keepAfterNavigationChange = false, timeout: number = 5000) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });

    if (timeout && timeout > 0) {
      setTimeout(() => {
        // clear alert after timeout
        this.subject.next();
      }, timeout);
    }
  }

  error(message: string, keepAfterNavigationChange = false, timeout?: number) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message });

    if (timeout && timeout > 0) {
      setTimeout(() => {
        // clear alert after timeout
        this.subject.next();
      }, timeout);
    }
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
