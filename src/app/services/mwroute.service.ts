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

    save(routeConfig: MWRouteConfig): Observable<MWRouteConfig> {
        const subject = new Subject<MWRouteConfig>();

        if (routeConfig) {
            const url = `${environment.server + environment.route}`;

            if (routeConfig._id && routeConfig._id.length > 0) {
                this.httpClient.put(
                    url,
                    routeConfig,
                    {
                        headers: this.httpHeaders,
                        observe: 'response',
                        reportProgress: true,
                        withCredentials: true
                    }
                ).subscribe(
                    (response: HttpResponse<MWRouteConfig>) => {
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
            } else {
                this.httpClient.post(
                    url,
                    routeConfig,
                    {
                        headers: this.httpHeaders,
                        observe: 'response',
                        reportProgress: true,
                        withCredentials: true
                    }
                ).subscribe(
                    (response: HttpResponse<MWRouteConfig>) => {
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
            }
        } else {
            subject.error('RouteConfig is null or empty');
        }

        return subject.asObservable();
    }
}