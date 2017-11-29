import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { State } from '../models/tasks.model';
import { GraphObject } from '../models/flow.model';

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

  getStatesByFolder(folder: string): Observable<State[]> {
    const subject = new Subject<State[]>();

    if (!folder) {
      folder = 'ALL';
    }

    const url = `${environment.server + environment.statebyfolderurl + folder}`;

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

  getStatesByStatus(status: string): Observable<State[]> {
    const subject = new Subject<State[]>();

    if (!status) {
      status = 'ACTIVE';
    }

    const url = `${environment.server + environment.statebystatusurl + status}`;

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

  update(state: State, machineType: string, entityId: string, payload: string): Observable<State> {
    const subject = new Subject<State>();

    const map = {};
    map['payload'] = state.payload;
    map['param'] = JSON.stringify(state.parameters);
    if (machineType === null) {
      machineType = `lead`;
    }

    const url = `${environment.server + environment.updatestatemachineurl}/${machineType}/${entityId}`;

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
}
