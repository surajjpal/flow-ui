import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { Domain } from '../models/domain.model';
import { Agent } from '../models/agent.model';
import { Dashboard } from '../models/dashboard.model';
import { Account } from '../models/account.model';
import { Episode, ChatMessage } from '../models/conversation.model';
import { environment } from '../../environments/environment';

@Injectable()
export class AgentService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

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

    
    

    const url = `${environment.dashboardServer + environment.dashboardsummary}`;

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

    const url = `${environment.dashboardServer + environment.episodetimeline}`;

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

    const url = `${environment.dashboardServer + environment.intentcount}`;

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
    
        const url = `${environment.dashboardServer + environment.entitycount}`;
    
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
        
            const url = `${environment.dashboardServer + environment.sentimentcount}`;
        
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
            
                const url = `${environment.dashboardServer + environment.goal_count}`;
            
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
                
                    const url = `${environment.dashboardServer + environment.episodemessages}`;
                
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
