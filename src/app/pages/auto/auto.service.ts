import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Dashboard, Episode, ChatMessage, TrainingData, IntentData, EntityData } from './auto.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class DashboardService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  fetch(configurationCode: string, dateRange: any): Promise<Dashboard> {
    const body: any = {};
    body.params = {};
    body.params.startDate = dateRange.start.format('YYYY-MM-DD HH:mm:ss');
    body.params.endDate = dateRange.end.format('YYYY-MM-DD HH:mm:ss');
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
export class ConversationService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  search(searchQuery: string): Promise<Episode[]> {
    const url = `${environment.autoServer}${environment.episodelisturl}${searchQuery}`;    // TODO: Same url used in local, dev & prod. Create environment specific urls.

    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(
        response => {
          return response.json() as Episode[];
        },
        error => error.json() as any)
      .catch(this.handleError);
  }

  getChat(episodeId: string): Promise<ChatMessage[]> {
    const url = `${environment.autoServer}${environment.messagelisturl}${episodeId}`;   // TODO: Same url used in local, dev & prod. Create environment specific urls.

    return this.http
      .get(url)
      .toPromise()
      .then(
        response => {
          return response.json() as ChatMessage[];
        },
        error => {
          return error.json() as any;
        }
      )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class TrainingService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getTrainingData(): Promise<TrainingData[]> {
    const url = `${environment.autoServer}${environment.trainingdataurl}`;    // TODO: Same url used in local, dev & prod. Create environment specific urls.

    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(
        response => {
          return response.json() as TrainingData[];
        },
        error => error.json() as any)
      .catch(this.handleError);
  }

  create(trainingData: TrainingData): Promise<any> {
    const url = `${environment.autoServer + environment.createtrainingdataurl}`;

    return this.http
    .post(url, trainingData, this.options)
    .toPromise()
    .then(
      response => response as any,
      error => error as any
    )
    .catch(this.handleError);
  }

  update(trainingData: TrainingData): Promise<any> {
    const url = `${environment.autoServer + environment.updatetrainingdataurl}`;

    return this.http
    .post(url, trainingData, this.options)
    .toPromise()
    .then(
      response => response as any,
      error => error as any
    )
    .catch(this.handleError);
  }

  delete(id: string): Promise<any> {
    const url = `${environment.autoServer + environment.deletetrainingdataurl + id}`;

    return this.http
      .delete(url, this.options)
      .toPromise()
      .then(
        response => response as any,
        error => error as any
      )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class IntentService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  fetchData(): Promise<IntentData[]> {
    const url = `${environment.autoServer + environment.getintenturl}`;

    return this.http
      .get(url, this.options)
      .toPromise()
      .then(
        response => response.json() as IntentData[],
        error => error.json() as any
      )
      .catch(this.handleError);
  }

  createData(intentData: IntentData): Promise<IntentData> {
    const url = `${environment.autoServer + environment.getintenturl}`;

    return this.http
      .post(url, intentData, this.options)
      .toPromise()
      .then(
        response => response.json() as IntentData,
        error => error as any
      )
      .catch(this.handleError);
  }

  updateData(intentData: IntentData): Promise<IntentData> {
    const url = `${environment.autoServer + environment.updateintenturl}`;

    return this.http
      .put(url, intentData, this.options)
      .toPromise()
      .then(
        response => response as any,
        error => error as any
      )
      .catch(this.handleError);
  }

  deleteData(intent: string): Promise<any> {
    const url = `${environment.autoServer + environment.deleteintenturl + intent}`;

    return this.http
      .delete(url, this.options)
      .toPromise()
      .then(
        response => response as any,
        error => error as any
      )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class EntityService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  fetchData(): Promise<EntityData[]> {
    const url = `${environment.autoServer + environment.getentityurl}`;

    return this.http
      .get(url, this.options)
      .toPromise()
      .then(
        response => response.json() as EntityData[],
        error => error.json() as any
      )
      .catch(this.handleError);
  }

  createData(entityData: EntityData): Promise<EntityData> {
    const url = `${environment.autoServer + environment.getentityurl}`;

    return this.http
      .post(url, entityData, this.options)
      .toPromise()
      .then(
        response => response.json() as EntityData,
        error => error as any
      )
      .catch(this.handleError);
  }

  updateData(entityData: EntityData): Promise<EntityData> {
    const url = `${environment.autoServer + environment.updateentityurl}`;

    return this.http
      .put(url, entityData, this.options)
      .toPromise()
      .then(
        response => response as any,
        error => error as any
      )
      .catch(this.handleError);
  }

  deleteData(entity: string): Promise<any> {
    const url = `${environment.autoServer + environment.deleteentityurl + entity}`;

    return this.http
      .delete(url, this.options)
      .toPromise()
      .then(
        response => response as any,
        error => error as any
      )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
