import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Jsonp, RequestOptions, Response } from '@angular/http';
import { User } from '../../models/user.model';
import { RoleRouteMap, ApiConfig } from '../../models/setup.model';
import { Account } from '../../models/account.model';

import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private router: Router, private http: Http) { }

  getAllUsers(): Promise<User[]> {
    const url = `${environment.server + environment.authurl}`;
    return this.http
      .get(url)
      .toPromise()
      .then(
        users => users.json() as User[],
        error => error.json() as any
      ).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class RoutesService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private router: Router, private http: Http) { }

  getAllRoutes() {
    const url = `${environment.server + environment.roleroutemapurl}`;
    return this.http
      .get(url)
      .toPromise()
      .then(
        routeList => routeList.json() as RoleRouteMap[],
        error => error as any
      ).catch(this.handleError);
  }

  createRoute(roleRouteMap: RoleRouteMap) {
    if (roleRouteMap) {
      roleRouteMap._id = null;

      const url = `${environment.server + environment.roleroutemapurl}`;
      return this.http
        .post(url, roleRouteMap, this.options)
        .toPromise()
        .then(
          route => route.json() as RoleRouteMap,
          error => error as any
        ).catch(this.handleError);
    } else {
      return Promise.reject('Object is null');
    }
  }

  updateRoute(roleRouteMap: RoleRouteMap) {
    if (roleRouteMap && roleRouteMap._id && roleRouteMap._id.length > 0) {
      const url = `${environment.server + environment.roleroutemapurl}`;
      return this.http
        .put(url, roleRouteMap, this.options)
        .toPromise()
        .then(
          route => route.json() as RoleRouteMap,
          error => error as any
        ).catch(this.handleError);
    } else {
      return Promise.reject('Invalid object');
    }
  }

  deleteRoute(roleRouteMap: RoleRouteMap) {
    if (roleRouteMap && roleRouteMap._id && roleRouteMap._id.length > 0) {
      const url = `${environment.server + environment.roleroutemapurl + '/' + roleRouteMap._id}`;
      return this.http
        .delete(url, this.options)
        .toPromise()
        .then(
          response => response as any,
          error => error as any
        ).catch(this.handleError);
    } else {
      return Promise.reject('Invalid object');
    }
  }

  rolesMaster() {
    const url = `${environment.server + environment.rolesurl}`;
    return this.http
      .get(url)
      .toPromise()
      .then(
        roleList => roleList.json() as string[],
        error => error as any
      ).catch(this.handleError);
  }

  routesMaster() {
    const url = `${environment.server + environment.routesurl}`;
    return this.http
      .get(url)
      .toPromise()
      .then(
        routeList => routeList.json() as string[],
        error => error as any
      ).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class ApiConfigService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private router: Router, private http: Http) { }

  getAllApi(): Promise<ApiConfig[]> {
    const url = `${environment.server + environment.apiconfigurl}`;
    return this.http
      .get(url)
      .toPromise()
      .then(
        apiConfigList => apiConfigList.json() as ApiConfig[],
        error => error.json() as any
      ).catch(this.handleError);
  }

  createApiConfig(apiConfig: ApiConfig) {
    if (apiConfig) {
      apiConfig._id = null;

      const url = `${environment.server + environment.apiconfigurl}`;
      return this.http
        .post(url, apiConfig, this.options)
        .toPromise()
        .then(
          apiConfigResponse => apiConfigResponse.json() as ApiConfig,
          error => error as any
        ).catch(this.handleError);
    } else {
      return Promise.reject('Object is null');
    }
  }

  updateApiConfig(apiConfig: ApiConfig) {
    if (apiConfig && apiConfig._id && apiConfig._id.length > 0) {
      const url = `${environment.server + environment.apiconfigurl}`;
      return this.http
        .put(url, apiConfig, this.options)
        .toPromise()
        .then(
          apiConfigResponse => apiConfigResponse.json() as ApiConfig,
          error => error as any
        ).catch(this.handleError);
    } else {
      return Promise.reject('Invalid object');
    }
  }

  deleteApiConfig(apiConfig: ApiConfig) {
    if (apiConfig && apiConfig._id && apiConfig._id.length > 0) {
      const url = `${environment.server + environment.apiconfigurl + apiConfig._id}`;
      return this.http
        .delete(url, this.options)
        .toPromise()
        .then(
          response => response as any,
          error => error as any
        ).catch(this.handleError);
    } else {
      return Promise.reject('Invalid object');
    }
  }

  getSupportedMethods(): Promise<string[]> {
    const url = `${environment.server + environment.supportedmethodsurl}`;
    return this.http
      .get(url)
      .toPromise()
      .then(
        methodList => methodList.json() as string[],
        error => error.json() as any
      ).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class AccountService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private router: Router, private http: Http) { }

  saveAccount(account: Account): Promise<any> {
    const url = `${environment.wheelsemiserver + environment.saveaccounturl}`;
    return this.http
      .post(url, account, { headers: this.headers })
      .toPromise()
      .then(
        response => response as any,
        error => error as any
      )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
