import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { environment } from 'environments/environment';
import { FtcConfig } from '../models/ftc.model';

@Injectable()
export class FtcService {
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private httpClient: HttpClient) { }

    fetch(): Observable<FtcConfig[]> {
        const subject = new Subject<FtcConfig[]>();

        const url = `${environment.server + environment.functionalTestCases}`;

        this.httpClient.get(
            url,
            {
                headers: this.httpHeaders,
                observe: 'response',
                reportProgress: true,
                withCredentials: true
            }
        ).subscribe(
            (response: HttpResponse<FtcConfig[]>) => {
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

    save(testConfig: FtcConfig): Observable<FtcConfig> {
        const subject = new Subject<FtcConfig>();

        if (testConfig) {
            const url = `${environment.server + environment.route}`;

            if (testConfig._id && testConfig._id.length > 0) {
                this.httpClient.put(
                    url,
                    testConfig,
                    {
                        headers: this.httpHeaders,
                        observe: 'response',
                        reportProgress: true,
                        withCredentials: true
                    }
                ).subscribe(
                    (response: HttpResponse<FtcConfig>) => {
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
                    testConfig,
                    {
                        headers: this.httpHeaders,
                        observe: 'response',
                        reportProgress: true,
                        withCredentials: true
                    }
                ).subscribe(
                    (response: HttpResponse<FtcConfig>) => {
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
            subject.error('TestConfig is null or empty');
        }

        return subject.asObservable();
    }

    
}