import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Dashboard, Episode, ChatMessage } from './auto.model';
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
export class ConversationService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  search(searchQuery: string): Promise<Episode[]> {
    // this.headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');

    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const url = `${environment.wheelsServer}${environment.episodelisturl}${searchQuery}`;    // TODO: Same url used in local, dev & prod. Create environment specific urls.

    return this.http
      .get(proxyurl + url, { headers: this.headers })
      .toPromise()
      .then(
        response => {
          return response.json() as Episode[];
        },
        error => error.json() as any)
      .catch(this.handleError);
  }

  getChat(episodeId: string): Promise<ChatMessage[]> {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const url = `${environment.wheelsServer}${environment.messagelisturl}${episodeId}`;   // TODO: Same url used in local, dev & prod. Create environment specific urls.

    return this.http
      .get(proxyurl + url)
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
