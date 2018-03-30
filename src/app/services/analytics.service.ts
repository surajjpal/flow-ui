import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { AnalyticsReportSetup, AnalyticsReport } from '../models/analytics.model';
import { ScheduleTaskConfiguration } from '../models/scheduler.model'
import { environment } from '../../environments/environment';
import { from } from 'rxjs/observable/from';

@Injectable()
export class AnalyticsService {
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private httpClient: HttpClient) {}

    sendReport(analyticsReport: AnalyticsReport): Observable<any> {
        const subject = new Subject<any>();
        const url = `${environment.server + environment.sendReportUrl}`;
        this.httpClient.post<AnalyticsReportSetup>(
            url,
            analyticsReport,
            {
              headers: this.httpHeaders,
              observe: 'response',
              reportProgress: true,
              withCredentials: true
            }
          ).subscribe(
            (response: HttpResponse<AnalyticsReportSetup>) => {
                console.log("response")
                console.log(response.body)
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
        console.log(analyticsReport);
        return subject.asObservable();
    }

    scheduleReport(scheduleTaskConfiguration: ScheduleTaskConfiguration): Observable<any> {
        const subject = new Subject<any>();
        const analyticsReport = new AnalyticsReport();
        console.log(scheduleTaskConfiguration);
        return subject.asObservable();
    }
}