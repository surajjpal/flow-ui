import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpEvent, HttpInterceptor, HttpHandler,
  HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { AlertService } from './shared.service';
import { UniversalUser } from './shared.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private universalUser: UniversalUser, private alertService: AlertService) { }

  dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method && req.body && (req.method === 'POST' || req.method === 'PUT')) {
      const parsedBody = JSON.parse(JSON.stringify(req.body), (key, value) => {
        if (value && typeof value === "string" && this.dateFormat.test(value)) {
          const tempDate = new Date(value);
          return {
            "$date": tempDate.getTime()
          };
        }
    
        return value;
      });

      if (JSON.stringify(req.body) === JSON.stringify(parsedBody)) {
        // let original req go ahead
      } else {
        req = req.clone({
          body: parsedBody
        });

        console.log("Parsed interceptor request :: ", req);
      }
    }

    return next.handle(req)
      .map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body) {
            const parsedResponseBody = JSON.parse(JSON.stringify(event.body), (key, value) => {
              if (value) {
                if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value instanceof Array) {
                  return value;
                } else if (value instanceof Object && Object.keys(value).length == 1 && value.hasOwnProperty("$date")) {
                  return new Date(value["$date"]);
                }
              }
          
              return value;
            });

            if (JSON.stringify(event.body) === JSON.stringify(parsedResponseBody)) {
              // let the original event go ahead
            } else {
              const parsedResponse = event.clone({
                body: parsedResponseBody
              });

              console.log("Parsed interceptor response :: ", parsedResponse);
              return parsedResponse;
            }
          }
        }

        return event;
      })
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
                this.alertService.error(err.error.message, false, 3000);
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
                  this.alertService.error(`${message}`, false, 3000);
                } else {
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
