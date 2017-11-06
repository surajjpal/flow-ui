import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Domain, Agent, Account } from './agent.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class AgentService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  modelKeysLookup(): Promise<string[]> {
    const url = `${environment.wheelsemiserver + environment.modelkeyslookupurl}`;
    return this.http
      .get(url)
      .toPromise()
      .then(
        response => response.json() as string[],
        error => error as any
      )
      .catch(this.handleError);
  }

  domainLookup(query?: string): Promise<Domain[]> {
    if (!query || query.length <= 0) {
      query = 'ALL';
    }

    const url = `${environment.wheelsemiserver + environment.fetchdomainurl + query}`;
    return this.http
      .get(url)
      .toPromise()
      .then(
        response => response.json() as Domain[],
        error => error as any
      )
      .catch(this.handleError);
  }

  agentLookup(query?: string): Promise<Agent[]> {
    if (!query || query.length <= 0) {
      query = 'ALL';
    }

    const url = `${environment.wheelsemiserver + environment.fetchagenturl + query}`;
    return this.http
      .get(url)
      .toPromise()
      .then(
        response => response.json() as Agent[],
        error => error as any
      )
      .catch(this.handleError);
  }

  saveDomain(domain: Domain): Promise<any> {
    const url = `${environment.wheelsemiserver + environment.savedomainurl}`;
    return this.http
      .post(url, domain, { headers: this.headers })
      .toPromise()
      .then(
        response => response as any,
        error => error as any
      )
      .catch(this.handleError);
  }

  saveAgent(agent: Agent): Promise<any> {
    const url = `${environment.wheelsemiserver + environment.saveagenturl}`;
    return this.http
      .post(url, agent, { headers: this.headers })
      .toPromise()
      .then(
        response => response as any,
        error => error as any
      )
      .catch(this.handleError);
  }

  saveAccount(account: Account): Promise<any> {
    const url = `${environment.wheelsemiserver + environment.saveaccounturl}`;
    return this.http
      .post(url, account, { headers: this.headers })
      .toPromise()
      .then(
        response => response as any,
        error => error as any
      )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
