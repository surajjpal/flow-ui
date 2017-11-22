import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { State } from '../../models/tasks.model';
import { GraphObject } from '../../models/flow.model';

import { environment } from '../../../environments/environment';

@Injectable()
export class DataSharingService {
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

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getStatesByFolder(folder: string): Promise<State[]> {
    if (!folder) {
      folder = 'ALL';
    }

    const url = `${environment.server + environment.statebyfolderurl + folder}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as State[])
      .catch(this.handleError);
  }

  getStatesByStatus(status: string): Promise<State[]> {
    if (!status) {
      status = 'ACTIVE';
    }

    const url = `${environment.server + environment.statebystatusurl + status}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as State[])
      .catch(this.handleError);
  }

  getXMLforActiveState(stateId: string): Promise<GraphObject> {
    const url = `${environment.server + environment.stateflowimageurl + stateId}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as GraphObject)
      .catch(this.handleError);
  }

  update(state: State, machineType: string, entityId: string, payload: string): Promise<State> {
    const map = {};
    map['payload'] = state.payload;
    map['param'] = JSON.stringify(state.parameters);
    if (machineType === null) {
      machineType = `lead`;
    }
    const url = `${environment.server + environment.updatestatemachineurl}/${machineType}/${entityId}`;
    return this.http
      .put(url, map, { headers: this.headers })
      .toPromise()
      .then(() => state)
      .catch(this.handleError);
  }

  updateState(state: State): Promise<State> {
    const map = {};
    map['payload'] = state.payload;
    map['param'] = JSON.stringify(state.parameters);
    const url = `${environment.server + environment.updatestatemachineurl}/`;
    return this.http
      .put(url, map, { headers: this.headers })
      .toPromise()
      .then(() => state)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
