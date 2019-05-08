import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { State, CommonInsightWrapper, StateReportModel, EmailPersister } from '../models/tasks.model';
import { GraphObject, StateInfoModel, DataPoint } from '../models/flow.model';
import { CRUDOperationInput } from '../models/crudOperationInput.model';
import { environment } from '../../environments/environment';


@Injectable()
export class DataCachingService {
  graphObject: any;
  selectedState: any;

  setSharedObject(graphObject: any, selectedState: any) {
    this.setGraphObject(graphObject);
    this.setSelectedState(selectedState);
  }

  setGraphObject(graphObject: any) {
    this.graphObject = graphObject;
  }

  setSelectedState(selectedState: any) {
    this.selectedState = selectedState;
  }

  getGraphObject() {
    let tempGraphObject = null;
    if (this.graphObject) {
      tempGraphObject = JSON.parse(JSON.stringify(this.graphObject));
      this.graphObject = null;
    }
    return tempGraphObject;
  }

  getSelectedState() {
    let tempSelectedState = null;
    if (this.selectedState) {
      tempSelectedState = JSON.parse(JSON.stringify(this.selectedState));
      this.selectedState = null;
    }
    return tempSelectedState;
  }
}

@Injectable()
export class StateService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  getStatesByStatusAndFolder(status: string, folder: string, pageNumber: any, fetchRecords: any): Observable<State[]> {
    const subject = new Subject<State[]>();

    if (!status) {
      status = 'ACTIVE';
    }

    if (!folder) {
      folder = 'Public';
    }


    const url = `${environment.server + environment.statebystatusandfolderurl}${pageNumber},${fetchRecords},${status},${folder}`;
    this.httpClient.get<State[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<State[]>) => {
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



  getStatesBySubStatusAndFolder(substatus: string, status: string, pageNumber: any, fetchRecords: any, type: string): Observable<State[]> {
    const subject = new Subject<State[]>();
    const url = `${environment.server + environment.statebysubstatusandfolderurl}${pageNumber},${fetchRecords},${substatus},${status},${type}`;


    this.httpClient.get<State[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<State[]>) => {
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

  getTimelineForFlow(flowId: string): Observable<any> {

    const subject = new Subject<any>();
    const url = `${environment.server + environment.timeline}${flowId}`;

    this.httpClient.get<any>(
      url,
      {
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

  updateVirtualAssist(stateInstance: State): Observable<any> {
    const subject = new Subject<any>();
    const url = `${environment.server + environment.updatevirtualassist }`;
    this.httpClient.post<State>(
      url,
      stateInstance,
      {
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
        subject.error(err);
      }
    )
    return subject.asObservable();
  }

  getInsightForState(stateId: string): Observable<any> {
    const subject = new Subject<any>();



    const url = `${environment.server + environment.stateinsight}${stateId}`;

    this.httpClient.get<any>(
      url,
      {
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


  getStates(machineId: string): Observable<StateInfoModel[]> {
    const subject = new Subject<StateInfoModel[]>();



    const url = `${environment.server + environment.orPayload}${machineId}`;

    this.httpClient.get<StateInfoModel[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<StateInfoModel[]>) => {
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


  getStatesByMachineType(machineType: string): Observable<StateInfoModel[]> {
    const subject = new Subject<StateInfoModel[]>();



    const url = `${environment.server + environment.orPayloadMachineType}${machineType}`;

    this.httpClient.get<StateInfoModel[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<StateInfoModel[]>) => {
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


  getXMLforActiveState(stateId: string): Observable<GraphObject> {
    const subject = new Subject<GraphObject>();

    const url = `${environment.server + environment.stateflowimageurl + stateId}`;

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

  update(machineType: string, entityId: string, param: any): Observable<State> {
    const subject = new Subject<State>();

    const map = {};
    map['param'] = JSON.stringify(param);
    map['payload'] = '{}';

    const url = `${environment.server + environment.updatestatemachineurl}/${machineType}/${entityId}`;

    this.httpClient.put<any>(
      url,
      map,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<State>) => {
        if (response.body) {
          subject.next(response.body);
        } else {
          subject.next();
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

  updateState(state: State): Observable<State> {
    const subject = new Subject<State>();

    const map = {};
    map['payload'] = state.payload;
    map['param'] = JSON.stringify(state.parameters);

    const url = `${environment.server + environment.updatestatemachineurl}/`;

    this.httpClient.put<State>(
      url,
      map,
      {
        headers: this.httpHeaders,
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


  saveFlaggedState(state: State, inputMap: any): Observable<State> {
    const subject = new Subject<State>();
    const map = {};
    map['param'] = JSON.stringify(inputMap);
    map['payload'] = '{}';
    console.log(state._id)

    const url = `${environment.server + environment.saveflaggedstate}/${state._id}/${state.flagReason}/`;

    this.httpClient.post<State>(
      url,
      map,
      {
        headers: this.httpHeaders,
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

  saveArchivedState(state: State): Observable<State> {
    const subject = new Subject<State>();

    console.log(state._id)

    const url = `${environment.server + environment.savearchivestate}`;

    this.httpClient.post<State>(
      url,
      state,
      {
        headers: this.httpHeaders,
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


  getTatRecords(stateReportModel: StateReportModel): Observable<any> {
    const subject = new Subject<any>();



    const url = `${environment.server + environment.gettatrecords}`;

    this.httpClient.post<any>(
      url,
      stateReportModel,
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


  getOverallStats(stateReportModel: StateReportModel): Observable<any> {
    const subject = new Subject<any>();



    const url = `${environment.server + environment.getallstats}`;

    this.httpClient.post<any>(
      url,
      stateReportModel,
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


  getPersonalStats(stateReportModel: StateReportModel): Observable<any> {
    const subject = new Subject<any>();



    const url = `${environment.server + environment.getpersonalstats}`;

    this.httpClient.post<any>(
      url,
      stateReportModel,
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

  getDataPointconfigurationFromFlowInstanceId(flowInstanceId: string): Observable<GraphObject> {

    const subject = new Subject<GraphObject>();
    const url = `${environment.server + environment.graphobjectbyflowinstanceid + "/" + flowInstanceId}`;
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

}

@Injectable()
export class EmailService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  getEmailTrail(entityId?: string): Observable<EmailPersister[]> {
    const subject = new Subject<EmailPersister[]>();
    const crudInput = new CRUDOperationInput();
    crudInput.collection = 'email';
    crudInput.payload = { "entityId": entityId }
    crudInput.operation = "READ_ALL";

    const url = `${environment.interfaceService + environment.smCrudFunction}`;
    this.httpClient.post<EmailPersister[]>(
      url,
      crudInput,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<EmailPersister[]>) => {
        if (response.body) {
          subject.next(response.body["data"]);
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



