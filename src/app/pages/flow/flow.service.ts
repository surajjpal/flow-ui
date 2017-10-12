import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Dashboard, GraphObject } from './flow.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class DashboardService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  fetch(configurationCode: string, dateRange: any): Promise<Dashboard> {
    const body: any = {};
    body.params = {};
    body.params.startDate = dateRange.start.format('DD-MM-YYYY HH:mm:ss');
    body.params.endDate = dateRange.end.format('DD-MM-YYYY HH:mm:ss');
    const url = `${environment.server + environment.autodashboardurl}/${configurationCode}`;
    return this.http
      .post(url, body, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Dashboard)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An dummy error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class GraphService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  save(graphObject: GraphObject): Promise<GraphObject> {
    if (graphObject) {
      const url = `${environment.server + environment.graphurl}`;
      if (graphObject._id && graphObject._id.length > 0) {
        return this.http
          .put(url, graphObject, { headers: this.headers })
          .toPromise()
          .then(response => response.json() as GraphObject)
          .catch(this.handleError);
      } else {
        return this.http
          .post(url, graphObject, { headers: this.headers })
          .toPromise()
          .then(response => response.json() as GraphObject)
          .catch(this.handleError);
      }
    }

    return Promise.reject('Graph object is null');
  }

  fetch(): Promise<GraphObject[]> {
    const url = `${environment.server + environment.graphurl}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as GraphObject[])
      .catch(this.handleError);
  }

  deactivate(_id: string): Promise<GraphObject> {
    const url = `${environment.server + environment.graphurl + _id}/close`;
    return this.http
    .get(url)
    .toPromise()
    .then(
      response => response.json() as GraphObject,
      error => error.json() as any
    )
    .catch(this.handleError);
  }

  activate(_id: string): Promise<GraphObject> {
    const url = `${environment.server + environment.graphurl + _id}/activate`;
    return this.http
    .get(url)
    .toPromise()
    .then(
      response => response.json() as GraphObject,
      error => error.json() as any
    )
    .catch(this.handleError);
  }

  getEntryActions(): Promise<string[]> {
    const url = `${environment.server + environment.entryactionurl}`;
    return this.http
    .get(url)
    .toPromise()
    .then(
      response => response.json() as string[],
      error => error.json() as any
    )
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class CommunicationService {
  sharedGraphObject: GraphObject;
  readOnly: boolean;
  // Observable string sources
  // private graphObjectSource = new Subject<GraphObject>();

  // Observable string streams
  // graphObjectReceived$ = this.graphObjectSource.asObservable();

  // Service message commands
  sendGraphObject(graphObject: GraphObject, readOnly?: boolean) {
    this.sharedGraphObject = graphObject;

    if (readOnly !== null) {
      this.readOnly = readOnly;
    } else {
      this.readOnly = false;
    }
    // console.log("Data received at service end. Object: " + this.sharedGraphObject);

    // this.graphObjectSource.next(graphObject);
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
