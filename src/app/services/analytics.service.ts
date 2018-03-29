import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { AnalyticsReportSetup } from '../models/analytics.model';
import { environment } from '../../environments/environment';

@Injectable()
export class AnalyticsService {
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private httpClient: HttpClient) {}

    scheduleReport(analyticsReportSetup: AnalyticsReportSetup): Observable<any> {
        const subject = new Subject<any>();
        console.log(analyticsReportSetup);
        return subject.asObservable();
    }
}