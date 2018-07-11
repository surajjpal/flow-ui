import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment/moment';

import { AnalyticsReportSetup, AnalyticsReport } from '../models/analytics.model';
import { ScheduleTaskConfiguration } from '../models/scheduler.model'
import { environment } from '../../environments/environment';
import { from } from 'rxjs/observable/from';
import { Agent } from 'app/models/agent.model';

@Injectable()
export class AnalyticsService {
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private httpClient: HttpClient) {}

    sendReport(analyticsReport: AnalyticsReportSetup): Observable<any> {
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
        console.log("schedule report");
        console.log(scheduleTaskConfiguration);
        return subject.asObservable();
    }

    scheduleDailyReportForAgent(agent: Agent): Observable<any> {
        const subject = new Subject<any>();
        
        const url = `${environment.interfaceService + environment.scheduleAnalyticsReport}`;
        const requestBody = {}
        requestBody["reportName"] = agent.name + " report";
        requestBody["requestedReportType"] = "SCHEDULE";
        requestBody["reportCategory"] = "STANDARD";
        requestBody["reportFileType"] = "pdf";
        requestBody["agentId"] = agent._id;
        requestBody["toEmailIds"] = ["sanket@automatapi.com"]
        requestBody["isInitAgentReport"] = true;
        requestBody["untilPreviousDay"] = true;
        requestBody["scheduleConfig"] = {}
        requestBody["scheduleConfig"]["subscription"] = "DAILY";
        requestBody["scheduleConfig"]["timeZone"] = "Asia/Kolkata";
        const currentDate = new Date();
        currentDate.setHours(9);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        requestBody["scheduleConfig"]["scheduleHour"] = currentDate.getHours();
        requestBody["scheduleConfig"]["scheduleMinute"] = currentDate.getMinutes()
        requestBody["scheduleConfig"]["scheduleSecond"] = currentDate.getSeconds();
        currentDate.setFullYear(currentDate.getFullYear() + 1);   
        requestBody["scheduleConfig"]["endTime"] = currentDate.toISOString(); // TODO
        console.log("scheduleDailyReportForAgent");
        console.log(requestBody);
        this.httpClient.post<any>(
            url,
            requestBody,
            {
              //headers: httpHeaders,
              observe: 'response',
              reportProgress: true,
              withCredentials: true
            }
          ).subscribe(
            (response: HttpResponse<any>) => {
                console.log("response")
                console.log(response.body)
                if (response.body) {
                    subject.next(response.body);
                }
            },
            (err: HttpErrorResponse) => {
              // All errors are handled in ErrorInterceptor, no further handling required
              // Unless any specific action is to be taken on some error
                console.log("error");
                console.log(err);
                subject.error(err);
            }
            );
        return subject.asObservable();
    }
}