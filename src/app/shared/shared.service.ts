import { Injectable } from '@angular/core';
import { Router, NavigationStart, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Headers, Http, Jsonp, RequestOptions, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { User } from './shared.model';

import { environment } from '../../environments/environment';

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
export class UserBroadcastService {
  // Observable users source
  private userSource = new Subject<boolean>();

  // Observable users stream
  broadcastedUsers$ = this.userSource.asObservable();

  // Call this method to braoadcast a user object
  broadcastUser(user: User) {
    if (user && user._id && user._id.length > 0) {
      this.userSource.next(true);
    } else {
      this.userSource.next(false);
    }
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
  ) {}

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
  ) {}

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
export class AuthService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(
    private router: Router,
    private http: Http,
    private universalUser: UniversalUser
  ) {}

  login(user: User) {
    const url = `${environment.server + environment.authurl}`;
    return this.http.post(url, user, { headers: this.headers })
      .map((response: Response) => {
        // login successful if there's a user object in the response
        if (!response.ok) {
          const body = response.json();
          return body.error;
        }

        const newUser = response.json();
        if (newUser) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.universalUser.setUser(newUser);
        }

        return newUser;
      });
  }

  logout() {
    // remove user from local storage to log user out
    this.universalUser.removeUser();
    this.router.navigate(['/login']);
  }

  authenticate(user: User): Promise<User> {
    if (user) {
      const url = `${environment.server + environment.authurl}`;
      return this.http
        .post(url, user, { headers: this.headers })
        .toPromise()
        .then(response => response.json() as User)
        .catch(this.handleError);
    }

    return Promise.reject('User object is null');
  }

  register(user: User) {
    const url = `${environment.server + environment.registerurl}`;
    return this.http.post(url, user, { headers: this.headers })
      .map((response: Response) => {
        // login successful if there's a user object in the response
        if (!response.ok) {
          const body = response.json();
          return body.error;
        }

        return response.json();
      });
  }

  update(user: User) {
    const url = `${environment.server + environment.updateuserurl}`;
    return this.http.put(url, user, { headers: this.headers })
      .map((response: Response) => {
        // login successful if there's a user object in the response
        if (!response.ok) {
          const body = response.json();
          return body.error;
        }

        return response.json();
      });
  }

  delete(userId: string) {
    const url = `${environment.server + environment.authurl + userId}`;
    return this.http.delete(url, { headers: this.headers })
      .map((response: Response) => {
        // login successful if there's a user object in the response
        if (!response.ok) {
          const body = response.json();
          return body.error;
        }

        return response.json();
      });
  }

  getAuthorities(): Promise<string[]> {
    const url = `${environment.server + environment.authoritiesurl}`;
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(
        response => response.json() as string[],
        error => error.json() as any
      )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
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

  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
