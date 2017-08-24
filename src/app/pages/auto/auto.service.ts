import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Dashboard } from './auto.model';
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
