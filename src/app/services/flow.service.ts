import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { GraphObject } from '../models/flow.model';
import { Dashboard } from '../models/dashboard.model';
import { ApiConfig } from '../models/setup.model';

import { environment } from '../../environments/environment';

@Injectable()
export class FlowDashboardService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  fetch(configurationCode: string, dateRange: any): Observable<Dashboard> {
    const subject = new Subject<Dashboard>();

    const body: any = {};
    body.params = {};
    body.params.startDate = dateRange.start.format('YYYY-MM-DD HH:mm:ss');
    body.params.endDate = dateRange.end.format('YYYY-MM-DD HH:mm:ss');

    const url = `${environment.server + environment.autodashboardurl}/${configurationCode}`;

    this.httpClient.post<Dashboard>(
      url,
      body,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Dashboard>) => {
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

@Injectable()
export class GraphService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private httpClient: HttpClient) { }

  save(graphObject: GraphObject): Observable<GraphObject> {
    const subject = new Subject<GraphObject>();

    if (graphObject) {
      const url = `${environment.server + environment.graphurl}`;

      if (graphObject._id && graphObject._id.length > 0) {
        this.httpClient.put<GraphObject>(
          url,
          graphObject,
          {
            headers: this.httpHeaders,
            observe: 'response',
            reportProgress: true,
            withCredentials: true
          }
        ).subscribe(
          (response: HttpResponse<GraphObject>) => {
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
        this.httpClient.post<GraphObject>(
          url,
          graphObject,
          {
            headers: this.httpHeaders,
            observe: 'response',
            reportProgress: true,
            withCredentials: true
          }
        ).subscribe(
          (response: HttpResponse<GraphObject>) => {
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
      subject.error('GraphObject is null or empty');
    }

    return subject.asObservable();
  }

  fetch(status?: string): Observable<GraphObject[]> {
    const subject = new Subject<GraphObject[]>();

    let url;
    if (status) {
      url = `${environment.server + environment.graphbystatusurl + status}`;
    } else {
      url = `${environment.server + environment.graphurl}`;
    }
    
    this.httpClient.get<GraphObject[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<GraphObject[]>) => {
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

  library(): Observable<GraphObject[]> {
    const subject = new Subject<GraphObject[]>();

    let url = `${environment.server + environment.graphlibrary}`;
   
    
    this.httpClient.get<GraphObject[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<GraphObject[]>) => {
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

  deactivate(_id: string): Observable<GraphObject> {
    const subject = new Subject<GraphObject>();

    const url = `${environment.server + environment.graphurl + _id}/close`;

    this.httpClient.get<GraphObject>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<GraphObject>) => {
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

  activate(_id: string): Observable<GraphObject> {
    const subject = new Subject<GraphObject>();

    const url = `${environment.server + environment.graphurl + _id}/activate`;

    this.httpClient.get<GraphObject>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<GraphObject>) => {
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

  getEntryActions(): Observable<string[]> {
    const subject = new Subject<string[]>();

    const url = `${environment.server + environment.entryactionurl}`;

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

  getTimerUnits(): Observable<string[]> {
    const subject = new Subject<string[]>();

    const url = `${environment.server + environment.timeruniturl}`;

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


  

  apiConfigLookup(): Observable<ApiConfig[]> {
    const subject = new Subject<ApiConfig[]>();

    const url = `${environment.server + environment.apiconfigurl}`;

    this.httpClient.get<ApiConfig[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<ApiConfig[]>) => {
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

@Injectable()
export class CommunicationService {
  sharedGraphObject: GraphObject;
  readOnly: boolean;
  
  sendGraphObject(graphObject: GraphObject, readOnly?: boolean) {
    this.sharedGraphObject = graphObject;

    if (readOnly !== null) {
      this.readOnly = readOnly;
    } else {
      this.readOnly = false;
    }
  }

  getGraphObject() {
    return this.sharedGraphObject;
  }

  isReadOnly() {
    return this.readOnly;
  }

  setReadOnly(readOnly: boolean) {
    this.readOnly = readOnly;
  }
}
