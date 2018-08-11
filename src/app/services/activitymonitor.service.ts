import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { BusinessProcessMonitorRequest } from '../models/businessprocessmonitor.model'
import { environment } from "../../environments/environment";



@Injectable()
export class ActivityMonitorService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  getDataPointValues(businessProcessMonitorRequest): Observable<any> {
    const subject = new Subject<any>();
    const url = `${environment.server + environment.businessDataPointValues}`;

    this.httpClient.post<any>(
        url, 
        businessProcessMonitorRequest,
        {
          headers: this.httpHeaders,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      ).subscribe(
        (response: HttpResponse<any>) => {
          console.log("success")
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