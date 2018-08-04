import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment/moment';

import { ScheduleTaskConfiguration } from '../models/scheduler.model'
import { environment } from '../../environments/environment';
import { from } from 'rxjs/observable/from';


@Injectable()
export class ScheduleTaskService {
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private httpClient: HttpClient) {}

    getScheduleTaskConfigurationById(_id: string, companyId: string): Observable<any> {
        const subject = new Subject<any>();
        const url = `${environment.root + environment.scheduleTaskConfiguration}` + "/" + _id;
        console.log(url);
        const headers =  new HttpHeaders({'x-consumer-custom-Id' : companyId});
        this.httpClient.get<ScheduleTaskConfiguration>(
                url,
                {
                    headers: headers,
                    observe: 'response',
                    reportProgress: true,
                    withCredentials: true
                }
            )
            .subscribe (
                (response: HttpResponse<ScheduleTaskConfiguration>) => {
                    console.log("schedule task configuration");
                    console.log(response.body);
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
}