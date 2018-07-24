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

    sendReport(analyticsReport: AnalyticsReport): Observable<any> {
        const subject = new Subject<any>();
        const url = `${environment.reportservice + environment.sendReportUrl}`;
        this.httpClient.post<AnalyticsReport>(
            url,
            analyticsReport,
            {
              //headers: headers,
              observe: 'response',
              reportProgress: true,
              withCredentials: true
            }
          ).subscribe(
            (response: HttpResponse<AnalyticsReport>) => {
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

    scheduleReport(analyticsReport: AnalyticsReport): Observable<any> {
        const subject = new Subject<any>();
        // console.log("schedule report");
        // console.log(analyticsReport);
        const url = `${environment.reportservice + environment.scheduleAnalyticsReport}`;
        this.httpClient.post<ScheduleTaskConfiguration>(
            url,
            analyticsReport,
            {
              //headers: headers,
              observe: 'response',
              reportProgress: true,
              withCredentials: true
            }
          ).subscribe(
            (response: HttpResponse<ScheduleTaskConfiguration>) => {
                // console.log("response")
                // console.log(response.body)
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

    getAnalyticsReports(): Observable<any> {
        const subject = new Subject<any>();
        const url = `${environment.reportservice + environment.getAnalyticsReports}`;
        this.httpClient.get<AnalyticsReport[]>(
                url,
                {
                    //headers: headers,
                    observe: 'response',
                    reportProgress: true,
                    withCredentials: true
                }
            )
            .subscribe (
                (response: HttpResponse<AnalyticsReport[]>) => {
                    // console.log("analytics reports");
                    // console.log(response.body);
                    if (response.body) {
                        subject.next(response.body);
                    }
                },
                (err: HttpErrorResponse) => {
                    subject.error(err);
                }

            )
        return subject.asObservable();
    }

    scheduleDailyReportForAgent(agent: Agent): Observable<any> {
        const subject = new Subject<any>();
        
        const url = `${environment.reportservice + environment.scheduleAnalyticsReport}`;
        const requestBody = {}
        const analyticsReport = new AnalyticsReport();
        analyticsReport.reportName = agent.name + " report";
        analyticsReport.requestedReportType = "SCHEDULE";
        analyticsReport.reportCategory = "STANDARD";
        analyticsReport.reportFileType = "pdf";
        analyticsReport.agentId = agent._id;
        analyticsReport.toEmailIds = ["sanket@automatapi.com"];
        analyticsReport.ccEmailIds = ["sanket@automatapi.com"];
        analyticsReport.isInitAgentReport = true;
        analyticsReport.untilPreviousDay = true;
        const scheduleTaskConfiguration = new ScheduleTaskConfiguration();
        scheduleTaskConfiguration.subscription = "DAILY";
        scheduleTaskConfiguration.timeZone = "Asia/Kolkata";
        const currentDate = new Date();
        currentDate.setHours(9);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setFullYear(currentDate.getFullYear() + 1);   
        scheduleTaskConfiguration.scheduleHour = currentDate.getHours();
        scheduleTaskConfiguration.scheduleMinute = currentDate.getMinutes();
        scheduleTaskConfiguration.scheduleSecond = currentDate.getSeconds();
        scheduleTaskConfiguration.endTime = currentDate.toISOString(); //TODO
        analyticsReport.scheduleConfig = scheduleTaskConfiguration;
        console.log("scheduleDailyReportForAgent");
        console.log(analyticsReport);
        this.httpClient.post<AnalyticsReport>(
            url,
            analyticsReport,
            {
              //headers: headers,
              observe: 'response',
              reportProgress: true,
              withCredentials: true
            }
          ).subscribe(
            (response: HttpResponse<AnalyticsReport>) => {
                // console.log("response")
                // console.log(response.body)
                if (response.body) {
                    subject.next(response.body);
                }
            },
            (err: HttpErrorResponse) => {
              // All errors are handled in ErrorInterceptor, no further handling required
              // Unless any specific action is to be taken on some error
                // console.log("error");
                // console.log(err);
                subject.error(err);
            }
            );
        return subject.asObservable();
    }
}