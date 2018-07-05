import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { Domain } from '../models/domain.model';
import { Agent } from '../models/agent.model';
import { Episode, ChatMessage } from '../models/conversation.model';
import { environment } from '../../environments/environment';
import { DomainService } from './domain.service';
import { CRUDOperationInput} from '../models/crudOperationInput.model';

@Injectable()
export class AgentService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient, private domainService: DomainService) { }

  /*
  domainLookup(query?: string): Observable<Domain[]> {
    return this.domainService.domainLookup(query);
  }

  agentLookup(query?: string): Observable<Agent[]> {
    const subject = new Subject<Agent[]>();

    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    const crudInput = new CRUDOperationInput();
    crudInput.payload = new Map<any, any>();
    crudInput.collection = 'agent';
    crudInput.operation = "READ_ALL";
    
    this.httpClient.post<Map<string, Agent[]>>(
      crudUrl, 
      crudInput,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Map<string, Agent[]>>) => {
        subject.next(response.body['data']);
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
    );
    
    return subject.asObservable();
  }

  saveAgent(agent: Agent): Observable<any> {
    const subject = new Subject<any>();

    console.log(agent.agentDomain)

    if (agent.agentDomain !== null) {
      agent.agentDomain = null;
    }

    const crudInput = new CRUDOperationInput();
    crudInput.payload = agent;
    crudInput.collection = 'agent';
    if (agent._id !== null) {
      crudInput.operation = "UPDATE";
    } else {
      crudInput.operation = "CREATE";
    }
    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    this.httpClient.post<any>(
      crudUrl, 
      crudInput,
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
        console.log(err);
        subject.error(err);
      }
    );

    return subject.asObservable();
  }*/

  domainLookup(query?: string): Observable<Domain[]> {
    const subject = new Subject<Domain[]>();

    if (!query || query.length <= 0) {
      query = 'ALL';
    }

    const url = `${environment.autoServer + environment.fetchdomainurl + query}`;

    this.httpClient.get<Domain[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Domain[]>) => {
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

  agentLookup(query?: string): Observable<Agent[]> {
    const subject = new Subject<Agent[]>();

    if (!query || query.length <= 0) {
      query = 'ALL';
    }

    const url = `${environment.autoServer + environment.fetchagenturl + query}`;

    this.httpClient.get<Agent[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Agent[]>) => {
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

  saveAgent(agent: Agent): Observable<any> {
    const subject = new Subject<any>();

    const url = `${environment.autoServer + environment.saveagenturl}`;

    this.httpClient.post<any>(
      url,
      agent,
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
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


@Injectable()
export class AgentDashboardService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  fetchSummary(body:any): Observable<any> {
    const subject = new Subject<any>();

    body['operation'] = "get_dashboard_summary";
    body['dashboard'] = "auto"
    const url = `${environment.dashboardinterface}`;

    this.httpClient.post<any>(
      url,
      body,
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



  fetchEpisodeTimeline(body:any): Observable<any> {
    const subject = new Subject<any>();
    body['operation'] = "get_episode_timeline";
    body['dashboard'] = "auto"
    const url = `${environment.dashboardinterface}`;

    this.httpClient.post<any>(
      url,
      body,
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


  fetchIntentCount(body:any): Observable<any> {
    const subject = new Subject<any>();
    body['operation'] = "get_intent_count";
    body['dashboard'] = "auto"
    const url = `${environment.dashboardinterface}`;


    this.httpClient.post<any>(
      url,
      body,
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


      fetchEntityCount(body:any): Observable<any> {
        const subject = new Subject<any>();
        body['operation'] = "get_entity_count";
        body['dashboard'] = "auto"
        const url = `${environment.dashboardinterface}`;
    
        this.httpClient.post<any>(
          url,
          body,
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


          fetchSentimentCount(body:any): Observable<any> {
            const subject = new Subject<any>();
            body['operation'] = "get_sentiment_count";
            body['dashboard'] = "auto"
            const url = `${environment.dashboardinterface}`;
        
        
            this.httpClient.post<any>(
              url,
              body,
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


              fetchGoalCount(body:any): Observable<any> {
                const subject = new Subject<any>();

                body['operation'] = "get_goal_count_effeciency";
                body['dashboard'] = "auto"
                const url = `${environment.dashboardinterface}`;
            
            
                this.httpClient.post<any>(
                  url,
                  body,
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

                  fetchEpisodeMessages(body:any): Observable<any> {
                    const subject = new Subject<any>();
                
                    body['operation'] = "get_episode_messages";
                    body['dashboard'] = "auto"
                    const url = `${environment.dashboardinterface}`;
                
                    this.httpClient.post<any>(
                      url,
                      body,
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

}

@Injectable()
export class ConversationService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  search(searchQuery: string): Observable<Episode[]> {
    const subject = new Subject<Episode[]>();

    const url = `${environment.autoServer + environment.episodelisturl + searchQuery}`;

    this.httpClient.get<Episode[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Episode[]>) => {
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

  getChat(episodeId: string): Observable<ChatMessage[]> {
    const subject = new Subject<ChatMessage[]>();

    const url = `${environment.autoServer + environment.messagelisturl + episodeId}`;

    this.httpClient.get<ChatMessage[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<ChatMessage[]>) => {
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

  getEpisode(episodeId: string): Observable<Episode> {
    const subject = new Subject<Episode>();

    const url = `${environment.autoServer + environment.episodebyidurl + episodeId}`;

    this.httpClient.get<Episode>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Episode>) => {
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
