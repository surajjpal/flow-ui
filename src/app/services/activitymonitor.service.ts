import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { BusinessProcessMonitorRequest, OnDemandReportRequest } from '../models/businessprocessmonitor.model'
import { environment } from "../../environments/environment";
import { DataPoint } from "app/models/flow.model";



@Injectable()
export class ActivityMonitorService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});

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

  getDataPoints(machineType: string): Observable<DataPoint[]> {
    const subject = new Subject<DataPoint[]>();
    const url = `${environment.server + environment.businessDataPoints + "/" + machineType}`;

    this.httpClient.get(
      url,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<DataPoint[]>) => {
        subject.next(response.body);
      },
      (err: HttpErrorResponse) => {
        subject.error(err);
      }
    )

    return subject.asObservable();

  }

  getCountwithPercentageChange(businessProcessMonitorRequest: BusinessProcessMonitorRequest): Observable<any> {
    const subject = new Subject<any>();
    const url = `${environment.server + environment.businessDataPonitsPercentageCount}`;

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

  getGraphData(businessProcessMonitorRequest: BusinessProcessMonitorRequest): Observable<any> {
    const subject = new Subject<any>();
    const url = `${environment.server + environment.businessDataPonitsGraphData}`;

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

  getGraphDataForDataPoint(businessProcessMonitorRequest: BusinessProcessMonitorRequest): Observable<any> {
    const subject = new Subject<any>();
    const url = `${environment.server + environment.businessFilterDataPonitsGraphData}`;

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

  sendReportCSV(onDemandReportRequest: OnDemandReportRequest): Observable<any> {
    const subject = new Subject<any>();
    const url = `${environment.sendReportCSV}`;
    
    this.httpClient.post<any>(
        url, 
        onDemandReportRequest,
        {
          headers: this.httpHeaders,
          reportProgress: true
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