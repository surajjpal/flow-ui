import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Jsonp, RequestOptions, Response } from '@angular/http';
import { User } from '../../shared/shared.model';

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
