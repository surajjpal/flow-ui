import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

import { Algorithm } from '../models/businessobject.model'
import { Subject } from "rxjs/Subject";
import { environment } from "environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class ApiDesignService {

    private httpHeaders = new HttpHeaders({ 'Content-Type' : 'application/json' });

    constructor(private httpClient: HttpClient) { }

    getAlgorithms():Observable<Algorithm[]> {
        const subject = new Subject<Algorithm[]>();
        

        const url = `${environment.apiDesignUrl + environment.algorithmUrl}`

        this.httpClient.get<Algorithm[]>(
            url,
            {
                observe: 'response',
                reportProgress: true,
                withCredentials: true
            }
        )
        .subscribe(
            (response: HttpResponse<Algorithm[]>) => {
                if (response.body) {
                    console.log("algorithms response success");
                    console.log(response.body);
                    subject.next(response.body);
                }
            },
            (err: HttpErrorResponse) => {
                // All errors are handled in ErrorInterceptor, no further handling required
                // Unless any specific action is to be taken on some error
                console.log("algorithms response error");
                console.log(err);
                subject.error(err);
              }
        );
        return subject.asObservable();
    }
}