import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { UniversalUser } from './shared.service';

@Injectable()
export class AuthService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private router: Router,
    private universalUser: UniversalUser,
    private httpClient: HttpClient
  ) { }

  logout() {
    // remove user from local storage to log user out
    this.universalUser.removeUser();
    this.router.navigate(['/login']);
  }

  authenticate(user: User): Observable<User> {
    const subject = new Subject<User>();

    if (user) {
      const url = `${environment.authurl}`;
      
      const body = {};
      body['username'] = user.username;
      body['password'] = user.password;

      this.httpClient.post<User>(
        url,
        body,
        {
          headers: this.httpHeaders,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<User>) => {
          if (response.body) {
            subject.next(response.body);
          }
        },
        (err: HttpErrorResponse) => {
          // All errors are handled in ErrorInterceptor, no further handling required
          // Unless any specific action is to be taken on some error

          subject.error(err);
        }
        );
    } else {
      subject.error('User object is null or empty');
    }

    return subject.asObservable();
  }

  register(user: User): Observable<User> {
    const subject = new Subject<User>();

    if (user) {
      const url = `${environment.server + environment.registerurl}`;

      this.httpClient.post<User>(
        url,
        user,
        {
          headers: this.httpHeaders,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<User>) => {
          if (response.body) {
            subject.next(response.body);
          }
        },
        (err: HttpErrorResponse) => {
          // All errors are handled in ErrorInterceptor, no further handling required
          // Unless any specific action is to be taken on some error

          subject.error(err);
        }
        );
    } else {
      subject.error('User object is null or empty');
    }

    return subject.asObservable();
  }

  createCompanyAdmin(map: any): Observable<User> {
    const subject = new Subject<User>();

    if (map) {
      const url = `${environment.server + environment.createcompanyadminurl}`;

      this.httpClient.post<User>(
        url,
        map,
        {
          headers: this.httpHeaders,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<User>) => {
          if (response.body) {
            subject.next(response.body);
          }
        },
        (err: HttpErrorResponse) => {
          // All errors are handled in ErrorInterceptor, no further handling required
          // Unless any specific action is to be taken on some error

          subject.error(err);
        }
        );
    } else {
      subject.error('Map object is null or empty');
    }

    return subject.asObservable();
  }

  update(user: User): Observable<User> {
    const subject = new Subject<User>();

    if (user) {
      const url = `${environment.server + environment.updateuserurl}`;

      this.httpClient.put<User>(
        url,
        user,
        {
          headers: this.httpHeaders,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<User>) => {
          if (response.body) {
            subject.next(response.body);
          }
        },
        (err: HttpErrorResponse) => {
          // All errors are handled in ErrorInterceptor, no further handling required
          // Unless any specific action is to be taken on some error

          subject.error(err);
        }
        );
    } else {
      subject.error('User object is null or empty');
    }

    return subject.asObservable();
  }

  delete(userId: string): Observable<any> {
    const subject = new Subject<any>();

    if (userId) {
      const url = `${environment.server + environment.userurl + userId}`;

      this.httpClient.delete<any>(
        url,
        {
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<any>) => {
          if (response.body) {
            subject.next(response.body);
          }
        },
        (err: HttpErrorResponse) => {
          // All errors are handled in ErrorInterceptor, no further handling required
          // Unless any specific action is to be taken on some error

          subject.error(err);
        }
        );
    } else {
      subject.error('User id is null or empty');
    }

    return subject.asObservable();
  }

  getAuthorities(): Observable<string[]> {
    const subject = new Subject<string[]>();
    
    const url = `${environment.server + environment.authoritiesurl}`;

    this.httpClient.get<string[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<string[]>) => {
        if (response.body) {
          subject.next(response.body);
        }
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
      );

    return subject.asObservable();
  }

  getAllUsers(): Observable<User[]> {
    const subject = new Subject<User[]>();

    const url = `${environment.server + environment.userurl}`;

    this.httpClient.get<User[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<User[]>) => {
        if (response.body) {
          subject.next(response.body);
        }
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
      );

    return subject.asObservable();
  }
}
