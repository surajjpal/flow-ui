import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { UniversalUser } from './shared.service';
import { CRUDOperationInput } from '../models/crudOperationInput.model';

@Injectable()
export class AuthService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private router: Router,
    private universalUser: UniversalUser,
    private httpClient: HttpClient
  ) { }

  logout(rediredUrl?: string) {
    // remove user from local storage to log user out
    this.universalUser.removeUser();

    if (rediredUrl && rediredUrl.trim().length > 0) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: rediredUrl } });
    } else {
      this.router.navigate(['/login']);
    }
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
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            subject.error(err);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            if (err) {
              let statusCd = 0;
              
              if (err.status) {
                statusCd = err.status;
              }

              if (statusCd === 0) {
                this.redirect()
                .subscribe(
                  user => {
                    subject.next(user);
                  },
                  error => {
                    subject.error(error);
                  }
                );
              } else {
                subject.error(err);
              }
            }
          }
        }
        );
    } else {
      subject.error('User object is null or empty');
    }

    return subject.asObservable();
  }

  forgotPassword(user: User): Observable<User> {
    const subject = new Subject<User>();

    if (user) {
      const url = `${environment.server + environment.forgotpassword}`;
      
      const body = {};
      body['username'] = user.username;
     

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
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            subject.error(err);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            if (err) {
              let statusCd = 0;
              
              if (err.status) {
                statusCd = err.status;
              }

              if (statusCd === 0) {
                this.redirect()
                .subscribe(
                  user => {
                    subject.next(user);
                  },
                  error => {
                    subject.error(error);
                  }
                );
              } else {
                subject.error(err);
              }
            }
          }
        }
        );
    } else {
      subject.error('User object is null or empty');
    }

    return subject.asObservable();
  }


  redirect(): Observable<User> {
    const subject = new Subject<User>();
    
    const url = `${environment.root}`;

    this.httpClient.get<User>(
      url,
      {
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
          subject.next(response);
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

  getCompanyAgent(companyId:string): Observable<any> {
    const subject = new Subject<any>();

    const url = `${environment.fetchaccountbyid + "6efe654013b041e79c5935e2228f34b2"}`;
    // const crudInput = new CRUDOperationInput();
    // crudInput.payload = {"_id":"6efe654013b041e79c5935e2228f34b2"};
    // crudInput.collection = 'companyAccount';
    // crudInput.operation = "READ";
    //crudInput.fields = ["agentId"];
    //crudInput["companyContext"] = {"companyId":"6efe654013b041e79c5935e2228f34b2"}
    this.httpClient.get<any>(
      url, 
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<any>) => {
        subject.next(response.body);
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
