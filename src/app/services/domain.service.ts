import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { Domain } from '../models/domain.model';
import { environment } from '../../environments/environment';

@Injectable()
export class DomainService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private httpClient: HttpClient) { }
  
  modelKeysLookup(): Observable<string[]> {
    const subject = new Subject<string[]>();

    const url = `${environment.autoServer + environment.modelkeyslookupurl}`;

    this.httpClient.get<string[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<string[]>) => {
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

  domainLookup(query?: string): Observable<Domain[]> {
    const subject = new Subject<Domain[]>();

    if (!query || query.length <= 0) {
      query = 'ALL';
    }

    const url = `${environment.autoServer + environment.fetchdomainurl + query}`;

    this.httpClient.get<Domain[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Domain[]>) => {
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

  saveDomain(domain: Domain): Observable<any> {
    const subject = new Subject<any>();

    const url = `${environment.autoServer + environment.savedomainurl}`;

    this.httpClient.post<any>(
      url,
      domain,
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
