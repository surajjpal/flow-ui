import { Injectable } from '@angular/core';
import { Router, NavigationStart, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { User } from '../models/user.model';
import { DataModel } from '../models/datamodel.model';
import { commonKeys } from '../models/constants';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

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

  setUser(user: User, shouldRedirect?: boolean) {
    window.localStorage.setItem(commonKeys.uninversalUser, JSON.stringify(user));
    this.user = user;

    if (shouldRedirect) {
      window.localStorage.setItem(commonKeys.sessionAvailable, new Date().getTime().toString());  
    }
  }

  setAgentId(agentId?:string){
    window.localStorage.setItem(commonKeys.companyAgentId, agentId);
  }

  getUser() {
    if (!this.user) {
      this.user = JSON.parse(window.localStorage.getItem(commonKeys.uninversalUser));
    }

    return this.user;
  }

  getAgentId(){
    return window.localStorage.getItem(commonKeys.companyAgentId);
  }

  removeUser() {
    this.user = null;
    window.localStorage.removeItem(commonKeys.uninversalUser);
    window.localStorage.setItem(commonKeys.sessionExpired, new Date().getTime().toString());
  }
}


@Injectable()
export class DataModelObject {
  private dataModel: DataModel;

  setDataModel(dataModel: DataModel, shouldRedirect?: boolean) {
    window.localStorage.setItem(commonKeys.dataModel, JSON.stringify(dataModel));
    this.dataModel = dataModel;

  //   if (shouldRedirect) {
  //     window.localStorage.setItem(commonKeys.sessionAvailable, new Date().getTime().toString());  
  //   }
   }


  getDataModel() {
    if (!this.dataModel) {
      this.dataModel = JSON.parse(window.localStorage.getItem(commonKeys.dataModel));
    }

    return this.dataModel;
  }

  
  removeDataModel() {
    this.dataModel = null;
    window.localStorage.removeItem(commonKeys.dataModel);
    //window.localStorage.setItem(commonKeys.dataModel, this.dataModel);
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

@Injectable()
export class ScrollService {

  constructor(private _scrollToService: ScrollToService) { }

  public triggerScrollTo(targetId: string) {

    const config: ScrollToConfigOptions = {
      target: targetId
    };

    this._scrollToService.scrollTo(config);
  }
}

@Injectable()
export class ObjectIdService {
  constructor() { }
  // TODO from last time - use this method to create ObjectId and use it to while creating new route in middleware route. Assign it to mxGraph vertex to uniquly identify every vertex while perfrorming operations.
  ObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
}