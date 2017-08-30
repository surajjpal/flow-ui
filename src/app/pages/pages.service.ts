import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';
import { Routes } from '@angular/router';

@Injectable()
export class RouteService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  routes(): Promise<Routes> {
    const body: any = {};
    const url = `${environment.server + environment.menurouteurl}`;
    return this.http
      .post(url, body, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Routes)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An dummy error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}