import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { environment } from 'environments/environment';
import { FtcConfig } from '../models/ftc.model';
import { User } from 'app/models/user.model';

@Injectable()
export class FtcFlowService {
    private httpHeaders;
    //= new HttpHeaders({ 'Content-Type': 'application/json'});

    constructor(private httpClient: HttpClient) { }

    invoke(tempConfig:FtcConfig): Observable<FtcConfig> {
        const subject = new Subject<FtcConfig>();
        const url = `${environment.root+environment.ftcRouteTrigger}`+tempConfig.routeCd;

        //http://localhost:8080/flow/api/route/
    
        this.httpHeaders = new HttpHeaders({'x-consumer-custom-id':tempConfig.companyId});
        this.httpClient.post(
            url,
            {},
            {
                headers: this.httpHeaders,
                observe: 'response',
                reportProgress: true,
                withCredentials: true
            }
        ).subscribe(
            (response: HttpResponse<any>) => {
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