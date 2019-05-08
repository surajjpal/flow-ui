import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { environment } from 'environments/environment';
import { MWRouteConfig } from '../models/mwroute.model';

@Injectable()
export class MWRouteService {
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private httpClient: HttpClient) { }

    fetch(): Observable<MWRouteConfig[]> {
        const subject = new Subject<MWRouteConfig[]>();

        const url = `${environment.server + environment.route}`;

        this.httpClient.get(
            url,
            {
                headers: this.httpHeaders,
                observe: 'response',
                reportProgress: true,
                withCredentials: true
            }
        ).subscribe(
            (response: HttpResponse<MWRouteConfig[]>) => {
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
}