import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, 
  HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { AlertService } from './shared.service';
import { UniversalUser } from './shared.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(req)
      .do(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.error instanceof Error) {
              // A client-side or network error occurred. Handle it accordingly.
              if (err && err.error && err.error.message) {
                this.alertService.error(err.error.message);
              }
            } else {
              // The backend returned an unsuccessful response code.
              // The response body may contain clues as to what went wrong,
              if (err) {
                let statusCd = 0;
                let message = '';

                if (err.status) {
                  statusCd = err.status;
                }
                if (err.error && err.error.message) {
                  message = err.error.message;
                }

                if (statusCd !== 401) {
                  this.alertService.error(`${message}`);
                }
              }
            }
          }
        }
      );
  }
}

@Injectable()
export class UnauthenticateInterceptor implements HttpInterceptor {
  constructor(private router: Router, private universalUser: UniversalUser, private alertService: AlertService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(req)
      .do(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.error instanceof Error) {
              // A client-side or network error occurred. Handle it accordingly.
            } else {
              // The backend returned an unsuccessful response code.
              // The response body may contain clues as to what went wrong,
              if (err && err.status) {
                if (err.status === 401) {
                  // Kill current session for logged in user, and send user to Login page
                  this.universalUser.removeUser();
                  if (err.message) {
                    if (err.message === 'Access is denied') {
                      this.alertService.error('Session timed out. Please login again.', true);
                    } else {
                      this.alertService.error('Authentication failed. Please login again.', true);
                    }
                  }
                  this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
                }
              }
            }
          }
        }
      );
  }
}
