import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { State } from './inbox.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class StateService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getStatesforfolder(folder: string): Promise<Map<string, string>[]> {
    console.log(folder);
    if (folder) {
      const url = environment.server + environment.folderurl + ',' + folder + ',ACTIVE';
      console.log('Task url: ' + url);
      return this.http
        .get(url).toPromise()
        .then(response => response.json() as Map<string, string>[])
        .catch(this.handleError);
    } else {
      return this.http
        .get(environment.server + environment.activestateurl).toPromise()
        .then(response => response.json() as Map<string, string>[])
        .catch(this.handleError);
    }
  }

  getParamforfolder(folder: string): Promise<Map<string, string>> {
    if (!folder) {
      folder = 'ALL';
    }
    return this.http
      .get(environment.server + environment.paramurl + folder).toPromise()
      .then(response => response.json() as Map<string, string>)
      .catch(this.handleError);

  }

  update(state: State, machineType: string, entityId: string, payload: string): Promise<State> {
    console.log(state.parameters['decision']);
    const map = {};
    map['payload'] = state.payload;
    map['param'] = JSON.stringify(state.parameters);
    console.log(map);
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
    console.log(JSON.stringify(map));
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
