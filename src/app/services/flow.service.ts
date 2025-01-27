import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { State, CommonInsightWrapper } from '../models/tasks.model';
import { GraphObject, ProcessModel, CommonSearchModel } from '../models/flow.model';
import { Dashboard } from '../models/dashboard.model';
import { ApiConfig, MVELObject } from '../models/setup.model';

import { environment } from '../../environments/environment';
import { AsyncAction } from 'rxjs/scheduler/AsyncAction';

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

  dashboard_summary(body): Observable<Dashboard> {
    const subject = new Subject<Dashboard>();
    body['operation'] = "get_flow_dashboard_summary"
    body['dashboard'] = "flow"

    const url = `${environment.dashboardinterface}`;

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

  flow_timeline(body): Observable<Dashboard> {
    const subject = new Subject<Dashboard>();
    body['operation'] = "get_flow_timeline"
    body['dashboard'] = "flow"
    const url = `${environment.dashboardinterface}`;

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

  transaction_range(body): Observable<Dashboard> {
    const subject = new Subject<Dashboard>();
    body['operation'] = "range_of_transaction";
    body['dashboard'] = "flow";
    const url = `${environment.dashboardinterface}`;

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

  consumption(body): Observable<Dashboard> {
    const subject = new Subject<Dashboard>();

    body['operation'] = "get_max_resources_values";
    body['dashboard'] = "flow";
    const url = `${environment.dashboardinterface}`;

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

  avg_time_states(body): Observable<Dashboard> {
    const subject = new Subject<Dashboard>();

    body['operation'] = "avg_state_time";
    body['dashboard'] = "flow";
    const url = `${environment.dashboardinterface}`;


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

  state_transactions(body): Observable<Dashboard> {
    const subject = new Subject<Dashboard>();

    body['operation'] = "transactionValue_each_state";
    body['dashboard'] = "flow";
    const url = `${environment.dashboardinterface}`;

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

export class ProcessService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  getAll(body: any): Observable<ProcessModel[]> {
    const subject = new Subject<ProcessModel[]>();

    let url;

    url = `${environment.interfaceService + environment.flowsearch}`;


    this.httpClient.post<ProcessModel[]>(
      url,
      body,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<ProcessModel[]>) => {
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
  getSelectedState(body: any): Observable<State> {
    const subject = new Subject<State>();

    let url;

    url = `${environment.server + environment.getstateinstance}`;


    this.httpClient.post<State>(
      url,
      body,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<State>) => {
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

  getGraphObject(id?: any) {
    const subject = new Subject<GraphObject>();

    let url;
    // if (status) {
    //   url = `${environment.server + environment.graphbystatusurl + status}`;
    // } else {
    //   url = `${environment.server + environment.graphurl}`;
    // }

    url = `${environment.server + environment.graphurl + id}`;

    this.httpClient.get<GraphObject>(
      url,

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

    return subject.asObservable();
  }

  fetch(commonSearchModel?: CommonSearchModel): Observable<GraphObject[]> {
    const subject = new Subject<GraphObject[]>();

    let url;
    url = `${environment.server + environment.graphbystatusurl}`;

    this.httpClient.post<GraphObject[]>(
      url,
      commonSearchModel,
      {
        headers: this.httpHeaders,
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

  testMVELExpression(mvelObject: MVELObject): Observable<MVELObject> {
    const subject = new Subject<MVELObject>();
    const url = `${environment.server + environment.graphurl + environment.evaluateMVEL}`;

    this.httpClient.post<MVELObject>(
      url,
      mvelObject,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<MVELObject>) => {
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

  getEntryActions(stateType: string): Observable<string[]> {
    const subject = new Subject<string[]>();

    const url = `${environment.server + environment.entryactionurl + "/" + stateType}`;

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
