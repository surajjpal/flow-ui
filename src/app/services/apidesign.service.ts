import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

import { Algorithm, BusinessObject } from '../models/businessobject.model'
import { Subject } from "rxjs/Subject";
import { environment } from "environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { UniversalUser } from './shared.service'

@Injectable()
export class ApiDesignService {

    private httpHeaders = new HttpHeaders();

    constructor(private httpClient: HttpClient, private univaersalUser: UniversalUser) { }

    getAlgorithms():Observable<Algorithm[]> {
        const subject = new Subject<Algorithm[]>();
        const companyId = this.univaersalUser.getUser().companyId;
        const headers = new HttpHeaders({'Content-Type' : 'application/json', 'x-customer-id' : companyId});
        const url = `${environment.apiDesignUrl + environment.algorithmUrl}`;
        console.log("companyID");
        console.log(companyId);
        //this.httpHeaders.append('Content-Type', 'application/json');
        //this.httpHeaders.append('x-customer-id', companyId);
        // this.httpHeaders.set('x-customer-id', companyId);
        // this.httpHeaders.set('Access-Control-Allow-Credentials', "true");
        // this.httpHeaders.set('Access-Control-Allow-Origin', "*");
        console.log("request headers");
        console.log(headers);
        this.httpClient.get<Algorithm[]>(
            url,
            {
                headers: headers,
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

    createBusinessObject(businessObject: BusinessObject):Observable<BusinessObject> {
        const subject = new Subject<BusinessObject>();
        const companyId = this.univaersalUser.getUser().companyId;
        const headers = new HttpHeaders({'Content-Type' : 'application/json', 'x-customer-id' : companyId});
        const url = `${environment.apiDesignUrl + environment.businessObjectUrl}`;
        this.httpClient.post<BusinessObject>(
            url,
            businessObject,
            {
                headers: headers,
                observe: 'response',
                reportProgress: true,
                withCredentials: true
            }
        )
        .subscribe(
            (response: HttpResponse<BusinessObject>) => {
                if (response.body) {
                    console.log("algorithms response success");
                    console.log(response.body);
                    subject.next(response.body);
                }
            },
            (err: HttpErrorResponse) => {
                
            }
        );
        return subject.asObservable();
    }

}