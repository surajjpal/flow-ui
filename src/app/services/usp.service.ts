import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { environment } from "../../environments/environment";

import { USPSearchRequest, USPSearchResult } from '../models/usp.model'



@Injectable()
export class USPService {
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});

    constructor(private httpClient: HttpClient) { }

    
    search(uspSearchRequest: USPSearchRequest) {
        const subject = new Subject<USPSearchResult>();
        const url = `${environment.interfaceService + environment.uspsearch}`;
        this.httpClient.post<USPSearchResult>(
            url,
            uspSearchRequest,
            {
                headers: this.httpHeaders,
                observe: 'response',
                reportProgress: true,
                withCredentials: true
            }
        ).subscribe(
            (response: HttpResponse<USPSearchResult>) => {
                subject.next(response.body);
            },
            (err: HttpErrorResponse) => {
                subject.error(err);
            }
        );
        return subject.asObservable();
    }

    selfTrainSerchData(highlights, query) {
        const subject = new Subject<any>();
        var selfTrainRequest = {
            highlight: highlights,
            searchText : query
            //companyContext: { "companyId" : "e95764c923e74e308d0019516b17cabd" }
        }
        const url = `${environment.interfaceService + environment.uspselftrain}`;
        //const url = "http://localhost:5010" + `${environment.uspselftrain}`
        this.httpClient.post<any>(
            url,
            selfTrainRequest,
            {
                headers: this.httpHeaders,
                observe: 'response',
                reportProgress: true,
                withCredentials: true
            }
        ).subscribe(
            (response: HttpResponse<any>) => {
                subject.next(response.body);
            },
            (err: HttpErrorResponse) => {
                subject.error(err);
            }
        );
        
    }

}